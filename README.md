# Event Booking System

This is a university group project for browsing events, booking seats, making payments, and viewing tickets online.

## Main Features

- user register and login
- JWT authentication
- profile and reviews
- event and venue pages
- seat selection and booking summary
- payment and ticket page
- booking history
- admin dashboard and booking report

## Tech Stack

- React + Vite
- Spring Boot
- Spring Security
- JPA
- MySQL or H2

## Team Work

- Ashan: auth, profile, reviews
- Vinuri: events, venues
- Nimesha: booking, payment, tickets, reports

## Project Structure

- `frontend/` for the React app
- `backend/` for the Spring Boot app
- `database/` for the SQL script

## Run The Project

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

## Demo Login

Admin:

- email: `admin@eventhub.com`
- password: `admin123`

User:

- create a new account from the register page


## Security

- passwords are hashed with BCrypt
- JWT is used after login
- booking pages need login
