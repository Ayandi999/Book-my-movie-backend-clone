# ChaiCode Cinema (BookMyShow Clone)

A modern, dynamic movie ticket booking backend built with speed and type safety in mind. 

## 🚀 Tech Stack
- **Runtime:** [Bun](https://bun.sh/)
- **Framework:** Express + TypeScript
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Auth:** JWT (Access & Refresh Tokens) + Argon2 Hashing
- **Email:** Nodemailer (SMTP)

## 🌟 Features
- **Seat Booking Engine:** Dynamic mapping of movies to halls. Real-time visualization via `index.html`.
- **Atomic Transactions:** Ensures no double-booking for the exact same seat concurrently.
- **Robust Authentication:** Secure Registration, Email Verification (via OTP/Code), Login, and Password Reset.
- **Type-Safe:** End-to-end validation using Zod middlewares.

## 🛠️ Local Setup Instructions

### 1. Prerequisites
- Install [Bun](https://bun.sh/)
- Have [Docker](https://www.docker.com/) installed (for the Postgres database).

### 2. Clone & Install Dependencies
```bash
git clone <your-repo-link>
cd <folder-name>
bun install
```

### 3. Environment Variables
Create a `.env` file in the root directory based on the provided `.env.example`:
```env
# Database
PORT=8080
DATABASE_URL="postgresql://userName:Password@localhost:5432/dbName"

# JWT Secrets
ACCESS_SECRET="your-super-secret-access-key"
REFRESH_SECRET="your-super-secret-refresh-key"

# Email SMTP (Ethereal / external SMTP)
SMTP_MAIL="your-email"
SMTP_PASSWORD="your-password"
```

### 4. Start the Database
Spin up the local Postgres database using Docker:
```bash
docker compose up -d
```

### 5. Run Migrations
Push the database schema to your Postgres instance:
```bash
bun run db:push
```
*(Update this command if you use a specific script to run Drizzle migrations)*

### 6. Start the Server
```bash
bun run dev
```

## 🎥 Testing the Frontend
Open your browser and navigate to:
```
http://localhost:8080/api/booking/<movieId>/<hallId>
```
Make sure you grab a `movieId` and `hallId` from your seeder or database. If you have logged in via Postman, add your JWT token to the browser's `localStorage` (`localStorage.setItem('accessToken', 'your_token')`) in the browser console to test live seat booking!
