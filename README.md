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
