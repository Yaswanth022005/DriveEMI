# DriveEMI — MERN Car EMI Calculator

DriveEMI is a small MERN (MongoDB, Express, React, Node) application that helps users calculate car EMIs, visualize payment breakdowns, and optionally save calculations to user history.

This README covers:
- Project structure
- Local development (backend + frontend)
- Environment variables
- API endpoints (examples)
- Frontend pages and behavior
- Deployment notes (EC2 + Nginx + PM2)
- Troubleshooting & common issues

## Project structure

At the repository root you'll find two main folders:

- `backend/` — Express server, Mongoose models, API routes
- `frontend/` — Vite + React app (Tailwind + DaisyUI + MUI mixed), pages and components

Other important files:
- `.env.example` — template environment file for backend
- `.gitignore` — project-level ignores
- `DEPLOYMENT.md` — deployment guidance and recommended steps

## Quick start (local development)

Prerequisites:
- Node.js (16+ recommended)
- npm or yarn
- MongoDB connection (local or Atlas)

1) Backend

```bash
cd backend
cp .env.example .env
# Edit .env and set MONGO_URI and JWT_SECRET if you plan to use auth
npm install
npm run dev
```

The server listens on the port defined in `.env` or defaults to `5012`.

Health / quick check:

```bash
curl http://localhost:5012/api/ping
```

2) Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server proxies API requests starting with `/api` to the backend. The proxy target is configured in `frontend/vite.config.js`.

Open the app in your browser — Vite will print the dev URL (usually `http://localhost:5173`).

## Environment variables

Copy and edit `backend/.env.example` to `backend/.env`:

- `MONGO_URI` — MongoDB connection string
- `PORT` — backend port (default: 5012)
- `JWT_SECRET` — secret for signing JWTs (set for auth)

## API endpoints (overview & examples)

The app exposes a small REST API under `/api`:

- POST `/api/calculate` — calculate EMI and (optionally) save to history
	- Body: { carPrice, downPayment, annualRate, tenureMonths, save }
	- Auth: optional (if `save: true` and user is logged in, calculation will be saved)

- POST `/api/auth/register` — create user (name, email, password) and receive JWT
- POST `/api/auth/login` — login (email, password) and receive JWT
- GET `/api/history` — get paginated history for the logged-in user (requires Bearer token)

Example: calculate EMI via curl

```bash
curl -X POST http://localhost:5012/api/calculate \
	-H 'Content-Type: application/json' \
	-d '{"carPrice":1000000,"downPayment":100000,"annualRate":7.5,"tenureMonths":60}'
```

Example: register a user (to test save/history)

```bash
curl -X POST http://localhost:5012/api/auth/register \
	-H 'Content-Type: application/json' \
	-d '{"name":"Alice","email":"alice@example.com","password":"secret"}'
```

## Frontend pages & behavior

- `/` — Landing / Home (marketing + quick links)
- `/cars` — Browse a curated list of popular cars (click a car to prefill the calculator)
- `/calculator` — The EMI calculator; accepts an initial car price (prefill)
- `/history` — Authenticated user's saved calculations; view and open amortization
- `/amortization` — Dedicated amortization UI: chart, paginated schedule, CSV export

UI tech:
- Vite + React
- Tailwind CSS + DaisyUI for layout and components (configured to light theme)
- MUI used in some components for form controls and snackbars
- Recharts for charts

Notes for developers:
- The Cars page uses Unsplash `source.unsplash.com` query links to display images. These are resilient for demos but not guaranteed for production.
- The frontend stores the JWT in `localStorage` and sends it as `Authorization: Bearer <token>` for protected API calls.

## Deployment notes (EC2 + Nginx + PM2)

This project includes `backend/Dockerfile` and `frontend/Dockerfile` (demo). For a simple EC2 + Nginx + PM2 flow:

1. Provision an EC2 instance and install Node.js, Nginx.
2. Clone this repository and build the frontend static files:

```bash
cd frontend
npm install
npm run build
```

3. Serve the frontend via Nginx (copy `dist/` to your web root or configure a proxy).
4. Start the backend with PM2:

```bash
cd backend
npm install
# set env variables
pm2 start index.js --name driveemi
```

5. Configure Nginx as a reverse proxy (example snippet) and enable HTTPS with Certbot.

For containerized deployments, the Dockerfiles can be used to build images and push to a registry.

## Troubleshooting & common issues

- 403 from frontend -> backend: ensure backend is running and Vite `proxy` (in `vite.config.js`) points to the backend port (5012 by default).
- 500 on register/calculate: check backend logs (server console) for stack traces. Ensure `MONGO_URI` is valid.
- Tailwind not applying: run `npm install` in `frontend` to ensure `tailwindcss`, `postcss` and `autoprefixer` are installed and Vite dev server restarted.

## Tests & validation

There are no automated tests in this scaffold. Recommended quick manual checks:

- Start backend and frontend locally and run the sample curl calls in the API section.
- Open `/cars` and verify images load and clicking a car navigates to `/calculator` with the price prefilled.
- Register and login, then save a calculation and confirm it appears in `/history`.

## Contributing

If you'd like to expand this project:

- Add input validation and unit tests for calculation logic.
- Replace Unsplash demo images with licensed thumbnails or host your own.
- Add CI (GitHub Actions) to run lint, build, and basic smoke tests.

---

If you want, I can also:
- Add a GitHub Actions workflow to run linting and build on push.
- Create a `docker-compose.yml` for local containerized development.

Happy hacking!
