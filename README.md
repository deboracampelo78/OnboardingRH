# Onboarding RH

Módulo independente de Onboarding para o sistema MyPlace (Benner). Integra-se ao MyPlace via API REST.

## Estrutura

- `backend/` — API REST em Node.js + Express + TypeScript, persistência em MongoDB (Mongoose)
- `frontend/` — Interface em React + TypeScript (Vite)

## Rodando localmente

### Backend

```
cd backend
copy .env.example .env
npm install
npm run dev
```

API disponível em `http://localhost:3001/api` (health check em `/api/health`).

### Frontend

```
cd frontend
copy .env.example .env
npm install
npm run dev
```

Interface disponível em `http://localhost:5173`.

## Recurso inicial

`onboarding-processes` — CRUD de processos de onboarding de colaboradores (`GET/POST /api/onboarding-processes`, `GET/PUT/DELETE /api/onboarding-processes/:id`).

## Deploy no Render

O arquivo `render.yaml` na raiz descreve os dois serviços (backend + frontend) como um Blueprint:

1. No [Render Dashboard](https://dashboard.render.com/), clique em **New > Blueprint**.
2. Conecte o repositório `deboracampelo78/OnboardingRH`.
3. Quando pedir a variável `MONGODB_URI` do serviço `onboardingrh-backend`, cole a connection string do MongoDB Atlas (a mesma do `backend/.env` local).
4. Confirme e aguarde os dois serviços (`onboardingrh-backend` e `onboardingrh-frontend`) buildarem.

Depois do primeiro deploy, confira as URLs reais que o Render atribuiu a cada serviço (aparecem no topo de cada serviço no dashboard). Se forem diferentes de `https://onboardingrh-backend.onrender.com` e `https://onboardingrh-frontend.onrender.com`:

- Atualize `CORS_ORIGIN` no serviço do backend com a URL real do frontend.
- Atualize `VITE_API_BASE_URL` no serviço do frontend com a URL real do backend + `/api`.
- Redeploy manual em cada serviço após o ajuste.
