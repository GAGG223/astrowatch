<div align="center">

# 🔭 AstroWatch

**Monitoramento de asteroides próximos à Terra em tempo real, com dados da API Asteroids NeoWs da NASA.**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![styled-components](https://img.shields.io/badge/styled--components-6-DB7093?logo=styled-components&logoColor=white)](https://styled-components.com/)
[![Vitest](https://img.shields.io/badge/Vitest-2-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![CI/CD](https://github.com/GAGG223/astrowatch/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/GAGG223/astrowatch/actions/workflows/ci-cd.yml)

### [🚀 Acessar a demo ao vivo](https://gagg223.github.io/astrowatch/)

</div>

---

## Visão geral

O **AstroWatch** consome a API **Asteroids - NeoWs** da NASA para listar os asteroides que se aproximaram da Terra em uma janela de até 7 dias. Para cada objeto, apresenta tamanho estimado, distância da aproximação e um alerta quando ele é classificado como potencialmente perigoso.

Projeto desenvolvido para o processo de recrutamento da **Olos** (vaga Front-End).

> A demo publicada já vem configurada com uma API Key da NASA e funciona sem nenhuma configuração.

---

## Funcionalidades

**Requisitos do desafio**

- **Listagem dos últimos 7 dias** — carregada automaticamente ao abrir.
- **Filtro por data** — seleção de um intervalo de início e fim (a API aceita no máximo 7 dias entre as datas).
- **Busca por nome** — filtro instantâneo sobre a lista carregada.
- **Cartão de cada asteroide** com:
  - Nome
  - Diâmetro estimado (mínimo e máximo, em km)
  - Distância da aproximação com a Terra
  - Alerta visual de **potencialmente perigoso**

**Diferenciais**

- **Atualizar agora** — refaz a busca sob demanda, exibindo a data/hora da última atualização.
- **Recarga na virada do dia** — ao mudar o dia, a janela de 7 dias é atualizada automaticamente (com uma verificação leve de data, sem requisições desnecessárias).
- **Resumo** com o total de asteroides e quantos são perigosos.
- Velocidade relativa e link para a página oficial de cada objeto no JPL/NASA.
- **Ordenação** (data, mais próximos ou maiores) e filtro para exibir **somente os perigosos**.
- **Validação do intervalo de datas** no próprio formulário, evitando o erro 400 da API para períodos acima de 7 dias.
- Estados de **carregamento, erro e vazio**, com tratamento amigável do limite de requisições (HTTP 429).
- Interface com tema **universo/NASA** (fundo estrelado, tipografia espacial) e **layout responsivo**.

---

## Tecnologias e decisões

| Tecnologia | Papel | Por quê |
| --- | --- | --- |
| **React 18** | Biblioteca de UI | Exigida pelo desafio; componentes funcionais com Hooks. |
| **TypeScript** | Linguagem | Tipa o contrato aninhado da API, reduz erros e serve de documentação. |
| **Vite** | Build / dev server | Inicialização e HMR rápidos; sucessor do Create React App. |
| **styled-components** | Estilização | CSS-in-JS com escopo isolado, tema central e estilos dinâmicos. |
| **ESLint** | Qualidade | Padronização e código limpo. |
| **Vitest + Testing Library** | Testes | Testes unitários e de integração, rodando no mesmo ecossistema do Vite. |
| **GitHub Actions** | CI/CD | Lint, testes e build a cada push/PR; deploy automático da `main` para o GitHub Pages. |

> O desafio exigia apenas **React + um framework de estilo**. TypeScript, Vite e styled-components foram escolhas complementares, permitidas e justificadas aqui.

A comunicação com a API usa a `fetch` nativa, sem cliente HTTP adicional, mantendo as dependências mínimas.

---

## Arquitetura

O código é organizado por **responsabilidade**, isolando a comunicação com a API, o gerenciamento de estado e a camada de apresentação.

```
src/
├── components/             # Camada de apresentação (UI)
│   ├── Header.tsx              # cabeçalho com logo da NASA e título
│   ├── Filters.tsx             # busca por nome + filtro por data (com validação)
│   ├── ListControls.tsx        # ordenação + filtro "somente perigosos"
│   ├── RefreshControl.tsx      # botão "atualizar agora" + última atualização
│   ├── ResultsSummary.tsx      # resumo (total / perigosos)
│   ├── AsteroidList.tsx        # grade de cartões
│   ├── AsteroidCard.tsx        # cartão de um asteroide
│   └── StatusMessage.tsx       # estados de loading / erro / vazio
├── hooks/
│   ├── useAsteroids.ts         # estado e ciclo de vida da busca
│   └── useDayChange.ts         # dispara a recarga na virada do dia
├── services/
│   └── nasaApi.ts              # chamada HTTP + normalização da resposta
├── types/                      # contrato da API NeoWs e modelo normalizado (Asteroid)
├── utils/                      # datas, formatação (pt-BR) e regras de filtro/ordenação
├── test/                       # setup, fixtures e helpers compartilhados pelos testes
├── styles/                     # tema, estilos globais e tipagem do styled-components
├── App.tsx                     # composição e orquestração geral
└── main.tsx                    # ponto de entrada
```

**Fluxo dos dados**

1. O **service** (`nasaApi.ts`) é a única camada que conhece a API da NASA. A resposta vem agrupada por data e com campos aninhados; ele achata tudo em uma lista e **normaliza** cada item para o modelo `Asteroid`, expondo à UI apenas o necessário.
2. O **hook** (`useAsteroids.ts`) gerencia o estado (dados, carregamento, erro, última atualização) e abstrai da tela *como* os dados chegam.
3. Os **componentes** recebem dados prontos e apenas renderizam.

Essa separação mantém o código testável, legível e fácil de evoluir. Os testes ficam ao lado do código que cobrem (`*.test.ts` / `*.test.tsx`).

---

## Testes e qualidade

- **64 testes** (Vitest + React Testing Library), cobrindo normalização da API, validação de datas, filtro/ordenação, o hook de estado (incluindo cancelamento de requisições concorrentes) e os principais fluxos do usuário.
- **CI/CD com GitHub Actions**: a cada push e pull request, o pipeline roda lint, testes e build; a cada push na `main`, publica automaticamente no GitHub Pages.
- **Lighthouse**: Performance 94, Acessibilidade 100, Boas práticas 100, SEO 100 (build de produção).

## Documentação do código

Todo o código-fonte é documentado com **JSDoc** e comentários explicativos:

- Funções, hooks e serviços descrevem propósito, parâmetros e retorno.
- As `interfaces` em `types/` documentam o contrato de dados da API e o modelo interno.
- Comentários pontuais explicam decisões não óbvias (ex.: por que a busca por nome é feita no cliente e o filtro de data vai à API).

---

## A API

- **Fonte:** API Asteroids NeoWs da NASA — documentação e geração de chave em https://api.nasa.gov/
- **Endpoint:** `GET /neo/rest/v1/feed?start_date=...&end_date=...&api_key=...`

A chave é lida da variável de ambiente `VITE_NASA_API_KEY`. Quando ausente, a aplicação usa automaticamente a `DEMO_KEY` pública da NASA (limite de requisições menor). Para configurar uma chave própria, copie `.env.example` para `.env` e preencha o valor.

> O arquivo `.env` está no `.gitignore` e nunca é versionado. O `.env.example` documenta a variável esperada sem expor segredos.

---

## Observações técnicas

- Datas são tratadas no fuso local e exibidas em pt-BR (DD/MM/AAAA); números usam `Intl`/`toLocaleString`.
- A **busca por nome** é feita no cliente sobre o resultado já carregado; o **filtro por data** dispara uma nova requisição à API.
- Scripts disponíveis: `dev`, `build`, `preview`, `lint`, `test` e `test:watch`. Requer Node.js 22.22+ (exigência do jsdom usado nos testes).
- Requisições à API são canceláveis (`AbortController`): ao disparar uma nova busca, a anterior é abortada, evitando que uma resposta antiga sobrescreva um resultado mais recente.
