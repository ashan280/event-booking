# Event Booking and Seat Reservation System

This repository is the shared codebase for the Event Booking and Seat Reservation System built with React, Spring Boot, and MySQL.

## Base Project Structure

- `frontend/`: React + Vite client
- `backend/`: Spring Boot API
- `database/`: MySQL starter schema
- `docs/`: workflow and project notes

## Branch Workflow

- `main`: final stable branch
- `develop`: shared integration branch
- `feature/member1-auth-user`: Member 1 work
- `feature/member2-event-venue`: Member 2 work
- `feature/member3-booking-payment`: Member 3 work

## Team Responsibilities

- Member 1: authentication, user management, reviews
- Member 2: events, categories, venues, search
- Member 3: booking, seats, payments, tickets, reports

## Merge Rules

1. Work only in your assigned feature branch.
2. Open pull requests from your feature branch into `develop`.
3. Test the full system on `develop`.
4. Merge `develop` into `main` only after team review and final testing.

## Commit Style

- `feat(auth): add login api`
- `fix(events): correct venue filter`

## Notes

Branch protection for `main` and pull request requirements must be configured in GitHub after this local repository is pushed to a remote.

## Local Start

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
