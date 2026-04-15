# BookMyMovie backend

A movie ticket booking backend built with Bun, Express, TypeScript, PostgreSQL, and Drizzle.

## Tech Stack
- Runtime: [Bun](https://bun.sh/)
- Language: TypeScript
- Framework: Express
- Database: PostgreSQL (Docker)
- ORM + Toolkit: Drizzle ORM + Drizzle Kit
- Auth/Security: JWT + Argon2
- Validation: Zod
- Email: Nodemailer

## Initial Setup

### 1) Prerequisites
- Install [Bun](https://bun.sh/)
- Install [Docker](https://www.docker.com/)

### 2) Install dependencies
Run from project root:

```bash
bun install
```

### 3) Create environment file
Create your own `.env` from `.env.example` and fill in real values:

```bash
cp .env.example .env
```

For Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Environment variables:

| Variable | Required | Example | Purpose |
| --- | --- | --- | --- |
| `PORT` | Yes | `8080` | API server port |
| `DATABASE_URL` | Yes | `postgresql://postgres:postgres@localhost:5432/chaicode` | PostgreSQL connection string |
| `ACCESS_SECRET` | Yes | `replace_with_access_secret` | JWT access token signing secret |
| `REFRESH_SECRET` | Yes | `replace_with_refresh_secret` | JWT refresh token signing secret |
| `SMTP_MAIL` | Yes | `you@example.com` | SMTP sender email |
| `SMTP_PASSWORD` | Yes | `app_password_here` | SMTP/app password |

### 4) Start PostgreSQL container (must be up)
This project expects the Docker Postgres config from `docker-compose.yml`:
- image: `postgres:17`
- port: `5432:5432`
- user: `postgres`
- password: `postgres`
- database: `chaicode`

Start Docker services:

```bash
docker compose up -d
```

Stop Docker services:

```bash
docker compose down
```

Stop Docker and remove DB volume (full reset):

```bash
docker compose down -v
```

### 5) Push schema to Postgres
Before testing APIs, make sure DB is initialized:

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

Now you can use Postman to test the API endpoints.

## Scripts and Usage
Use scripts with:

```bash
bun run <scriptName>
```

Available scripts:
- `dev` - starts the server in watch mode (`bun --watch src/index.ts`)
- `build` - builds the app into `dist` (`bun build src/index.ts --outdir dist`)
- `generatedb` - generates Drizzle migration files from schema
- `migratedb` - runs Drizzle migrations
- `pushdb` - pushes current schema directly to DB
- `livedb` - opens Drizzle Studio for DB inspection

## Suggested Test Flow
1. `docker compose up -d`
2. `bun run pushdb`
3. `bun run dev`
4. Test endpoints in Postman
