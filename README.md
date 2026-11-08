# Sweety – Blood Glucose Tracker

Sweety is a full-stack blood glucose tracking application built for the Kenpath Junior Full Stack Developer assignment. It lets a registered user record glucose readings by date and meal-time slot, review their reading history, and view summary reports.

> **Health note:** Sweety is a personal tracking tool, not a medical device. Its readings and summaries are not a diagnosis or a substitute for advice from a qualified healthcare professional.

## Features

### Implemented in the repository

- User registration and login using email and password.
- Password hashing with `bcryptjs`.
- JWT-based sessions stored in an HTTP-only `accessToken` cookie.
- Create, list, retrieve, update, and delete glucose readings.
- Four reading slots: Morning, After breakfast, After lunch, and After dinner.
- Reading values are validated as whole numbers from 40 to 600 mg/dL.
- A user cannot create a second reading for the same date and slot.
- The create flow limits a user to four readings per day.
- Daily, month-to-date, previous-month, and custom date-range report endpoints.
- Dashboard, reading, report, login, registration, and profile pages.

### Not implemented / not confirmed

- No seed script or demo account is included in the repository.
- No automated frontend tests are configured.
- The root `npm test` script is a placeholder and intentionally exits with an error.
- No Docker configuration, Redis cache, background reminder worker, or doctor role is present.
- The API currently does not enforce the assignment's no-future-date rule. See [Known limitations](#known-limitations).

## Technology stack

| Area | Technologies |
|---|---|
| Monorepo | npm workspaces |
| Backend | Node.js, TypeScript, Express 5 |
| Database | PostgreSQL |
| Data access / schema tooling | Prisma ORM 8 release-candidate CLI and `@prisma/orm-postgres` |
| Authentication | JSON Web Tokens, `bcryptjs), HTTP-only cookies |
| Validation | Zod |
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4, custom CSS |
| Data fetching | TanStack Query, Fetch API |
| Forms | React Hook Form, Zod resolvers |
| Backend tooling | tsx, TypeScript, Vitest, Supertest (installed) |
| Frontend tooling | ESLint 9, eslint-config-next |

The backend uses the PostgreSQL ORM runtime from `@prisma/orm-postgres`. The repository also has an `@prisma/client` dependency, but the application data-access implementation is in `apps/server/src/config/post_db.ts`.

## Repository structure

```text
kenpath-sweety/
├── .env.example
├── package.json
├── package-lock.json
└── apps/
    ├── client/
    │   ├── package.json
    │   ├── next.config.ts
    │   ├── eslint.config.mjs
    │   └── src/
    │       ├── app/
    │       │   ├── (auth)/login/page.tsx
    │       │   ├── (auth)/register/page.tsx
    │       │   ├── dashboard/page.tsx
    │       │   ├── profile/page.tsx
    │       │   ├── readings/page.tsx
    │       │   ├── reports/page.tsx
    │       │   ├── globals.css
    │       │   ├── layout.tsx
    │       │   └── page.tsx
    │       ├── components/
    │       │   ├── app-shell.tsx
    │       │   ├── auth-shell.tsx
    │       │   ├── health-dashboard.tsx
    │       │   └── query-provider.tsx
    │       ├── features/
    │       │   ├── auth/services/auth-api.ts
    │       │   ├── readings/
    │       │   │   ├── components/reading-board.tsx
    │       │   │   ├── hooks/use-readings.ts
    │       │   │   └── services/readings-api.ts
    │       │   └── reports/
    │       │       ├── components/report-overview.tsx
    │       │       ├── hooks/use-reports.ts
    │       │       └── services/reports-api.ts
    │       ├── lib/
    │       │   ├── api.ts
    │       │   └── dummy-data.ts
    │       └── proxy.ts
    └── server/
        ├── package.json
        ├── prisma.config.ts
        ├── prisma/
        │   ├── schema.prisma
        │   └── contract.json
        ├── generated/prisma8/
        ├── migrations/
        └── src/
            ├── app.ts
            ├── server.ts
            ├── config/
            │   ├── env.ts
            │   └── post_db.ts
            ├── modules/
            │   ├── auth/
            │   │   ├── controllers/
            │   │   ├── routes/
            │   │   ├── services/
            │   │   └── validators/
            │   ├── readings/
            │   │   ├── controllers/
            │   │   ├── repositories/
            │   │   ├── routes/
            │   │   ├── services/
            │   │   └── validators/
            │   └── reports/
            │       ├── controllers/
            │       └── routes/
            ├── types/
            │   ├── auth.types.ts
            │   ├── jwt.types.ts
            │   └── reading.types.ts
            └── utils/jwt.ts
```

## Prerequisites

- Node.js **22.18 or newer**. Prisma ORM 8's PostgreSQL runtime has a Node.js 22.18+ requirement.
- npm (included with Node.js).
- PostgreSQL running locally or a reachable PostgreSQL instance.
- Git.

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/snax-07/kenpath-sweety.git
cd kenpath-sweety
```

### 2. Install dependencies

Run this from the repository root. The root package uses npm workspaces for both applications.

```bash
npm install
```

### 3. Configure environment variables

Create a root-level `.env` file from the supplied example:

```bash
cp .env.example .env
```

Update the values in `.env`:

```dotenv
DATABASE_URL="postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/sweety?schema=public"
JWT_SECRET="replace-this-with-a-long-random-secret"
PORT=8080
```

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string used by the backend and Prisma configuration. |
| `JWT_SECRET` | Secret used to sign and verify authentication tokens. Use a long, random value; do not use the example value in a deployed environment. |
| `PORT` | Port on which the Express API listens. Defaults to `8080` if omitted. |

The frontend reads `NEXT_PUBLIC_API_URL` if it is provided. Otherwise, it defaults to `http://localhost:8080/api/v1`; no frontend API URL is currently listed in `.env.example`.

**Important:** The server and Prisma configuration search for `.env` and fall back to `.env.example`. Set a real database URL and replace the example JWT secret in your local `.env` before starting the application.

### 4. Create the PostgreSQL database

Using `psql` as a PostgreSQL user with permission to create databases:

```sql
CREATE DATABASE sweety;
```

Or run:

```bash
createdb sweety
```

Make sure the database name, username, password, host, and port in `DATABASE_URL` match your PostgreSQL setup.

### 5. Prepare the database schema

The database model is defined in `apps/server/prisma/schema.prisma`. The project uses the Prisma ORM 8 release-candidate CLI and its `prisma.config.ts` configuration rather than the Prisma 7 `migrate dev` workflow.

From the repository root, emit the ORM contract:

```bash
cd apps/server
npx prisma contract emit
```

The config points the generated output to `generated/prisma8`.

**Database initialization note:** The repository does not contain conventional Prisma 7 SQL migration files or a seed script. For a brand-new, empty database, Prisma ORM 8 provides `db init` to initialize the database from the contract. Review the target database carefully before running it:

```bash
npx prisma db init
```

These commands use the installed Prisma CLI and the config in `apps/server/prisma.config.ts`. Do not run database initialization against a database containing data you need to preserve.

## Run the applications

Open two terminal windows from the repository root.

### Backend API

```bash
npm run dev --workspace=server
```

The API listens on [http://localhost:8080](http://localhost:8080) by default.

Health check:

```text
GET http://localhost:8080/health
```

### Frontend

```bash
npm run dev --workspace=client
```

Open [http://localhost:3000](http://localhost:3000).

To point the frontend at a different API URL, set `NEXT_PUBLIC_API_URL` in the environment available to the Next.js process, for example:

```dotenv
NEXT_PUBLIC_API_URL="http://localhost:8080/api/v1"
```

## Database schema

The Prisma schema defines two models and one enum.

### User

- `id`: UUID primary key.
- `name`: user's name.
- `email`: unique email address.
- `passwordHash`: bcrypt password hash.
- `createdAt`, `updatedAt`: timestamps.
- Relation to the user's glucose readings.

### Reading

- `id`: UUID primary key.
- `userId`: owning user's UUID; deleting a user cascades to their readings.
- `readingDate`: date of the reading.
- `slot`: reading-time enum.
- `value`: integer glucose value in mg/dL.
- `createdAt`, `updatedAt`: timestamps.
- Unique constraint on `(userId, readingDate, slot)`.
- Index on `(userId, readingDate)`.

### ReadingSlot

```text
MORNING
AFTER_BREAKFAST
AFTER_LUNCH
AFTER_DINNER
```

The API accepts these enum values. The UI can display more readable labels.

## API reference

All API routes are mounted under `/api/v1`. Authentication uses the HTTP-only `accessToken` cookie; send requests with credentials enabled.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/signup` | Register a user. Body: `{ "name", "email", "password" }`. |
| POST | `/auth/login` | Log in. Body: `{ "email", "password" }`. |
| POST | `/auth/logout` | Clear the session cookie. |
| GET | `/auth/me` | Return the authenticated user's profile. |

### Readings

| Method | Endpoint | Description |
|---|---|---|
| GET | `/readings` | List the authenticated user's readings. |
| POST | `/readings` | Create a reading. Body: `{ "readingDate": "YYYY-MM-DD", "slot": "MORNING", "value": 100 }`. |
| GET | `/readings/:id` | Retrieve one of the authenticated user's readings. |
| PATCH | `/readings/:id` | Update a reading. Accepts optional `readingDate`, `slot`, and `value` fields. |
| DELETE | `/readings/:id` | Delete a reading. |

Reading values must be integers from 40 through 600 mg/dL. The create flow rejects an existing slot for the same user and date and rejects a fifth reading for that date. The database also has a unique constraint on user, date, and slot.

### Reports

| Method | Endpoint | Query parameters | Description |
|---|---|---|---|
| GET | `/reports/daily` | `date=YYYY-MM-DD` (optional) | Readings and summary for the selected date; defaults to today. |
| GET | `/reports/month-to-date` | `date=YYYY-MM-DD` (optional) | From the first day of the selected month through the selected date. |
| GET | `/reports/monthly` | `date=YYYY-MM-DD` (optional) | Previous full calendar month relative to the selected date. |
| GET | `/reports/range` | `from=YYYY-MM-DD&to=YYYY-MM-DD` | Custom date-range report. |

Report responses include `average`, `highest`, `lowest`, `count`, `readings`, and `periodLabel`. The average is rounded to one decimal place. In the current implementation, empty summaries return zero values and an empty readings array.

## Scripts

Run commands from the repository root unless stated otherwise.

| Command | Purpose |
|---|---|
| `npm run dev --workspace=server` | Start the Express server in watch mode using tsx. |
| `npm run build --workspace=server` | Compile the backend TypeScript with its configured tsconfig. |
| `npm run start --workspace=server` | Start the compiled backend from `apps/server/dist/server.js` (run the backend build first). |
| `npm run test --workspace=server` | Run Vitest in the backend workspace. No test files are currently present in the repository. |
| `npm run dev --workspace=client` | Start the Next.js development server. |
| `npm run build --workspace=client` | Build the Next.js frontend for production. |
| `npm run start --workspace=client` | Start the production Next.js server after building. |
| `npm run lint --workspace=client` | Run ESLint for the frontend. |

The root-level `npm test` script is currently a placeholder that exits with `Error: no test specified`; it is not a working test command.

## Demo data

There is currently no database seed script or documented demo account in the repository. Register a user through the application, then add readings through the readings page or API.

## Screenshots

Add current application screenshots here before submission. No screenshot files are currently tracked in the repository.

<!-- Suggested screenshots:
- Registration / login
- Dashboard with summary cards
- Reading list and add-reading form
- Reports view
-->

## Known limitations

- The reading validator currently checks the date is present but does not reject future dates.
- The four-readings-per-day limit is checked in application code during creation; it is not protected by a transaction or database-level daily-count constraint, so concurrent requests could race.
- The update flow checks for duplicate user/date/slot combinations but does not enforce the four-per-day limit after moving a reading to another date.
- The API sets the authentication cookie as HTTP-only and SameSite=Lax, but the cookie options do not currently set the `secure` flag for HTTPS deployments.
- The server's Vitest script exists, but no automated test files are included.
- The root test script is still the npm-init placeholder.
- No seed/demo data, Docker setup, Redis cache, background job, or doctor-role workflow is included.

## Potential improvements

1. Add automated backend tests for authentication, reading CRUD, ownership isolation, validation, and report calculations.
2. Enforce future-date validation and make the daily reading limit concurrency-safe.
3. Add database setup/migration documentation and a repeatable seed script for reviewer-friendly local testing.
4. Configure production cookie security, environment validation, and stricter CORS origins.
5. Add frontend tests and accessibility checks.
6. Add deployment configuration and CI checks for linting, tests, and builds.

## Author

**Swapnil Nade**

Repository: [github.com/snax-07/kenpath-sweety](https://github.com/snax-07/kenpath-sweety)
