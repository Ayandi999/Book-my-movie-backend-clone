# 🎬 BookMyMovie Backend

Fast, type-safe movie ticket booking backend built with Bun + Express + TypeScript + PostgreSQL + Drizzle.

## 📺 Project Walkthrough

[![BookMyMovie Walkthrough](https://img.youtube.com/vi/NVldN_HAq08/maxresdefault.jpg)](https://www.youtube.com/watch?v=NVldN_HAq08)

*Click the image above to watch the full project guide on YouTube.*

## 🚀 Tech Stack
- ⚡ Runtime: [Bun](https://bun.sh/)
- 🧠 Language: TypeScript
- 🌐 Framework: Express
- 🐘 Database: PostgreSQL (Docker)
- 🧩 ORM + Toolkit: Drizzle ORM + Drizzle Kit
- 🔐 Auth/Security: JWT + Argon2
- ✅ Validation: Zod
- 📧 Email: Nodemailer

## 🛠️ Initial Setup

### 1) Prerequisites
- Install [Bun](https://bun.sh/)
- Install [Docker](https://www.docker.com/)

### 2) Install dependencies
From project root:

```bash
bun install
```

### 3) Create your environment file
Copy `.env.example` and fill in real values:

```bash
cp .env.example .env
```

For Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 🔑 Environment Variables

| Variable | Required | Example | Purpose |
| --- | --- | --- | --- |
| `PORT` | Yes | `8080` | API server port |
| `DATABASE_URL` | Yes | `postgresql://postgres:postgres@localhost:5432/chaicode` | PostgreSQL connection string |
| `ACCESS_SECRET` | Yes | `replace_with_access_secret` | JWT access token signing secret |
| `REFRESH_SECRET` | Yes | `replace_with_refresh_secret` | JWT refresh token signing secret |
| `SMTP_MAIL` | Yes | `you@example.com` | SMTP sender email |
| `SMTP_PASSWORD` | Yes | `app_password_here` | SMTP/app password |

### 4) Start PostgreSQL container (must be running)
Expected Docker config from `docker-compose.yml`:
- image: `postgres:17`
- port: `5432:5432`
- user: `postgres`
- password: `postgres`
- database: `chaicode`

Start Docker services:

```bash
docker compose up -d
```

### 5) Push schema to PostgreSQL
Before API testing, initialize DB:

```bash
bun run pushdb
```

### 6) Optional: Preview DB in Drizzle Studio

```bash
bun run livedb
```

### 7) Run development server

```bash
bun run dev
```

Now you are ready to test endpoints in Postman. 🎯

## 📜 Scripts and Usage
Run any script with:

```bash
bun run <scriptName>
```

Available scripts:
- `dev` → start server in watch mode (`bun --watch src/index.ts`)
- `build` → build app into `dist` (`bun build src/index.ts --outdir dist`)
- `generatedb` → generate Drizzle migration files from schema
- `migratedb` → run Drizzle migrations
- `pushdb` → push schema directly to database
- `livedb` → open Drizzle Studio for DB inspection

## 🧪 Suggested Test Flow
1. `docker compose up -d`
2. `bun run pushdb`
3. `bun run dev`
4. Test endpoints in Postman

## 📬 Postman Collection Guide

This project includes a ready collection:
- `postman/BookMyMovie.postman_collection.json`

### 1) Import collection in Postman
1. Open Postman
2. Click **Import**
3. Select `postman/BookMyMovie.postman_collection.json`
4. Click **Import** again

### 2) Set collection variables
1. In the left sidebar, find **BookMyMovie API Demo Flow**
2. Click the **three dots (...)** next to the collection name
3. Click **Edit**
4. Open the **Variables** tab

Important variables:
- `baseUrl` (default `http://localhost:8080`)
- `movieId`
- `hallId`
- `seatId`
- `verifyCode`
- `resetCode`
- `accessToken`
- `refreshToken`

### 3) Run requests in order
1. `1 - Get Movies`
2. `2 - Get Halls By Movie`
3. `3 - Register User`
4. `4 - Validate Email (Manual Code)` (set `verifyCode` first)
5. `5 - Login` (stores `accessToken` + `refreshToken`)
6. `7 - Get Seats`
7. `8 - Book Seat (Protected)` (set `seatId` if needed)
8. `9 - Refresh Token`
9. `10 - Logout`

### 4) Auto variable behavior
- `movieId` is auto-saved after `1 - Get Movies`
- `hallId` is auto-saved after `2 - Get Halls By Movie`
- `accessToken` and `refreshToken` are auto-saved after `5 - Login` and `9 - Refresh Token`

If any auto-save fails, set the value manually in the collection **Variables** tab.

## 🧹 Optional Cleanup
When you are done:

```bash
docker compose down
```

## ⚠️ Danger Zone (Data Reset)
Use this only if you want a fresh database from scratch. This removes Docker volumes and deletes local Postgres data.

```bash
docker compose down -v
```
