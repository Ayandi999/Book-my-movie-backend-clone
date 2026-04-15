# 🎬 BookMyMovie Backend

Fast, type-safe movie ticket booking backend built with Bun + Express + TypeScript + PostgreSQL + Drizzle.

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
