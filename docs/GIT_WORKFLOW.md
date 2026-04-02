# Git Workflow

## Branches

- `main`
- `develop`
- `feature/member1-auth-user`
- `feature/member2-event-venue`
- `feature/member3-booking-payment`

## How We Work

1. Pull the latest `develop`.
2. Switch to your own feature branch.
3. Commit only your module work.
4. Open a pull request into `develop`.
5. Resolve conflicts before merge.
6. After integration testing, merge `develop` into `main`.

## Important Rules

- Do not commit directly to `main`.
- Do not use `develop` for personal feature work.
- If another member merges shared changes, sync `develop` into your feature branch before continuing.
- Shared database, API, and contract changes must be agreed by the team before merge.

## Suggested Commands

```bash
git checkout develop
git pull
git checkout feature/member1-auth-user
git merge develop
```
