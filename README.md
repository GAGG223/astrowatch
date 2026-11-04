# AstroWatch

Aplicação web em **React** que consome a API **Asteroids - NeoWs** da NASA para listar os asteroides que se aproximaram da Terra em um intervalo de até 7 dias.

Desenvolvida como parte do processo de recrutamento da Olos (vaga Front-End).

## Funcionalidades

Atendendo ao que foi pedido no desafio:

- **Lista dos asteroides dos últimos 7 dias** — carregada automaticamente ao abrir a aplicação.
- **Filtro por data** — selecione um intervalo de data inicial e final (a API aceita no máximo 7 dias entre elas).
- **Busca pelo nome do asteroide** — filtro instantâneo aplicado sobre a lista carregada.
- **Cada item da lista exibe:**
  - Nome do asteroide
  - Estimativa de diâmetro mínima e máxima (em quilômetros)
  - Distância que ele passou da Terra
  - Aviso visual quando o asteroide é **potencialmente perigoso**

Extras para usabilidade:

- **Atualizar agora** — botão que refaz a busca na API sob demanda, com indicador da data/hora da última atualização.
- **Atualização na virada do dia** — quando o dia muda, a lista é recarregada automaticamente para a nova janela de 7 dias (sem requisições desnecessárias: apenas uma verificação leve de data).
- Resumo com total de asteroides e quantos são perigosos.
- Velocidade relativa e link para a página do objeto no JPL/NASA.
- Estados de carregamento, erro e vazio; tratamento amigável do limite de requisições (HTTP 429).
- Tema visual "universo/NASA" (fundo estrelado, logo da NASA, tipografia espacial) e layout responsivo.

## Tecnologias e decisões

| Tecnologia | Motivo |
| --- | --- |
| **React 18** | Exigido pelo desafio. |
| **TypeScript** | Tipagem da resposta da API reduz erros e documenta o contrato de dados. |
| **Vite** | Build e dev server rápidos, setup enxuto. |
| **styled-components** | "Qualquer framework de estilo" era permitido; CSS-in-JS mantém estilo e componente coesos, com tema centralizado (paleta universo/NASA). |
| **ESLint** | Garante o critério de código limpo. |

A aplicação usa apenas a `fetch` nativa (sem cliente HTTP extra), mantendo as dependências mínimas.

### Organização do código

```
src/
├── components/         # Componentes de UI
│   ├── Header.tsx          # cabeçalho com logo da NASA e título
│   ├── Filters.tsx         # busca por nome + filtro por data
│   ├── RefreshControl.tsx  # botão "atualizar agora" + última atualização
│   ├── ResultsSummary.tsx  # resumo (total / perigosos)
│   ├── AsteroidList.tsx     # grade de cartões
│   ├── AsteroidCard.tsx     # cartão de um asteroide
│   └── StatusMessage.tsx    # estados de loading / erro / vazio
├── hooks/
│   ├── useAsteroids.ts     # estado e ciclo de vida da busca
│   └── useDayChange.ts     # dispara recarga na virada do dia
├── services/
│   └── nasaApi.ts          # chamada HTTP e normalização da resposta
├── styles/                 # tema, estilos globais e tipagem do styled-components
├── types/                  # tipagem da API NeoWs e modelo normalizado (Asteroid)
├── utils/                  # helpers de data e formatação (pt-BR)
├── App.tsx                 # composição e orquestração geral
└── main.tsx                # ponto de entrada
```

A resposta bruta da API agrupa os asteroides por data; o serviço achata tudo em uma única lista e normaliza cada objeto para o modelo `Asteroid`, expondo para a UI apenas os campos necessários.

## A API

- Documentação e geração da API Key: https://api.nasa.gov/ (seção **Asteroids NeoWs**)
- Endpoint utilizado: `GET /neo/rest/v1/feed?start_date=...&end_date=...&api_key=...`

Por padrão a aplicação usa a `DEMO_KEY`, que tem um limite baixo de requisições. Para evitar o erro de limite (HTTP 429), gere sua própria chave e configure-a:

1. Copie `.env.example` para `.env`
2. Preencha `VITE_NASA_API_KEY` com a sua chave

```
VITE_NASA_API_KEY=suachaveaqui
```

> O arquivo `.env` está no `.gitignore` para não versionar a chave.

## Como rodar

Pré-requisitos: Node.js 18+ e npm.

```bash
# instalar dependências
npm install

# ambiente de desenvolvimento (http://localhost:5173)
npm run dev

# build de produção
npm run build

# pré-visualizar o build
npm run preview

# análise estática
npm run lint
```

## Observações

- As datas são tratadas no fuso local e exibidas no formato brasileiro (DD/MM/YYYY); números são formatados com `Intl`/`toLocaleString` em pt-BR.
- A busca por nome é feita no cliente sobre o resultado já carregado; o filtro por data dispara uma nova requisição à API.
