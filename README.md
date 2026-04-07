# Event Booking and Seat Reservation System

This is a university group project for browsing events, booking seats, making payments, and viewing tickets.

## Tech Used

- React
- Vite
- Spring Boot
- Spring Security
- JPA
- H2 or MySQL

## Main Features

- user register and login
- JWT based authentication
- profile and review pages
- event list and event details
- venue pages
- seat selection and booking summary
- payment page and ticket page
- booking history
- admin dashboard and booking report

## Project Folders

- `frontend/` React app
- `backend/` Spring Boot app
- `database/` SQL script
- `docs/` for local notes only

## Team Work

- `Ashan` worked on auth, profile, and reviews
- `Vinuri` worked on events and venues
- `Nimesha` worked on booking, payment, tickets, and reports

## Branches

- `main` final branch
- `dev` team branch
- `feature/ashan-auth-user`
- `feature/vinuri-event-venue`
- `feature/nimesha-booking-payment`

## Simple Git Flow

1. Do one small task.
2. Make one simple commit.
3. Push to your feature branch.
4. Merge feature branch into `dev`.
5. Test in `dev`.
6. Merge `dev` into `main` at the end.

## Run the Project

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
mvn spring-boot:run
```

## Demo Accounts

Admin:

- email: `admin@eventhub.com`
- password: `admin123`

User:

- create a new account from the register page

## Environment Values

Frontend:

- `VITE_API_URL` for the backend URL
- default: `http://localhost:8080`

Backend:

- `FRONTEND_URL` for the frontend URL
- `APP_JWT_SECRET` for the JWT secret
- `DB_URL` for the database URL
- `DB_USERNAME` for the database username
- `DB_PASSWORD` for the database password

## Security

- passwords are hashed with BCrypt
- JWT is used after login
- booking pages need login
- admin pages and admin event actions need admin role

## Data Exchange

- the frontend and backend use JSON for requests and responses
- the frontend calls backend APIs with `fetch`
- the backend returns simple JSON responses

## Simple Deployment Note

For local demo or deployment, the frontend and backend should use matching URLs:

- frontend `VITE_API_URL`
- backend `FRONTEND_URL`

Example:

- frontend on `http://localhost:5173`
- backend on `http://localhost:8080`

## Simple Commit Names

- `add login page`
- `fix register form`
- `add event list`
- `add booking page`
