# Playd

Playd is a full-stack personal video game tracking service built for a diploma project.

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, React Query, Axios, React Router, Zustand
- Backend: NestJS, TypeScript, REST API, JWT auth
- Database: PostgreSQL, TypeORM
- Integrations: IGDB API through Twitch OAuth, Steam Web API

## Project Structure

```text
frontend/
  src/
    api/
    components/
    hooks/
    pages/
    store/
    types/
backend/
  src/
    common/
    modules/
      auth/
      users/
      games/
      library/
      reviews/
      stats/
      steam/
      admin/
```

The previous static prototype is still kept at the repository root as legacy files. The diploma application lives in `frontend/` and `backend/`.

## Environment

Create `backend/.env`:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/playd
JWT_SECRET=change_me
IGDB_CLIENT_ID=
IGDB_CLIENT_SECRET=
STEAM_API_KEY=
FRONTEND_URL=http://localhost:5173
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

## Setup

1. Start PostgreSQL:

```bash
docker compose up -d postgres
```

2. Install dependencies:

```bash
npm install --prefix backend
npm install --prefix frontend
```

3. Run backend:

```bash
npm run dev:backend
```

4. Run frontend:

```bash
npm run dev:frontend
```

Frontend: `http://localhost:5173`

Backend API: `http://localhost:3000/api`

## Implemented Features

- Register and login with JWT
- Auto-login after registration
- Protected routes with localStorage token persistence
- User profile read/update
- Game catalog and IGDB search endpoint
- Local DB cache for IGDB search results
- Add/update/remove games in user library
- One review per user per game
- Reviews allowed only for games marked as `finished`
- User statistics endpoint and charts
- Steam import endpoint with private profile handling
- Role-based admin API and admin page

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me`
- `PATCH /api/users/me/profile`
- `GET /api/games`
- `POST /api/games/search`
- `GET /api/games/:id`
- `GET /api/library`
- `POST /api/library`
- `PATCH /api/library/:id`
- `DELETE /api/library/:id`
- `GET /api/reviews`
- `GET /api/reviews/game/:gameId`
- `POST /api/reviews`
- `GET /api/stats`
- `POST /api/steam/import`
- `GET /api/admin/users`
- `GET /api/admin/reviews`
- `POST /api/admin/games`
