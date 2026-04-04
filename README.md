# Event Booking and Seat Reservation System

A web application for browsing events, reserving seats, and managing bookings.

## Tech

- React
- Spring Boot
- MySQL

## Folders

- `frontend/` for React
- `backend/` for Spring Boot
- `database/` for SQL
- `docs/` for local notes only

## Team

- `Ashan` for auth, user, review
- `vinuri` for event, venue, category, search
- `nimesha` for booking, seat, payment, ticket, report

## Branches

- `main` is final
- `develop` is team branch
- `feature/ashan-auth-user`
- `feature/vinuri-event-venue`
- `feature/nimesha-booking-payment`

## Workflow

1. Do one small task.
2. Make one simple commit.
3. Push only to your feature branch.
4. Merge feature branch to `develop`.
5. Test in `develop`.
6. Merge `develop` to `main` at the end.

## Simple Commit Names

- `add login page`
- `fix register form`
- `add event list`
- `add booking page`

## Run Project

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
