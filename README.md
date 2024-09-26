# zen-task
Just another simple task and project management tool. :)

[![CI](https://github.com/pitagg/zen-task/actions/workflows/ci.yml/badge.svg)](https://github.com/pitagg/zen-task/actions/workflows/ci.yml)

> [!IMPORTANT]
> This project is still in progress. Feel free to explore it, be patient though.

# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...


## General feature information

- Authentication with JWT (POST /login with email and password).
- Route /me to check logged user data (GET /me with header Authorization + JWT).
- JWT expires in 24 hours.
- Activity end_date is updated to the current date when it's marked as completed.
- API versioning: `/api/v1/...`.

## Setup

### Back-end

**Install dependencies:**

`bundle install`

**Setup database:**

`bundle exec rails db:prepare` to create the database, apply schema and run seeds.

> [!TIP]
> `db:prepare` is idempotent, so it will only perform the necessary tasks once. If a reset is necessary, use `db:setup` instead, which will cleanup and rebuild the database. Use it carefully!

**Master Key:**

For security reasons the file `credentials.yml` is encrypted with a secret master key, which must be in the `/config` folder. It obviously is not staged in the repo, so if you didn't receive the file, just ask for it.

After saving the master key in the config folder, the following code must successfully decript and open `credentials.yml` for edition. It's a good way to make sure it's all set.

`VISUAL="code --wait" bundle exec rails credentials:edit`

Note: Replace `code` with your preferred editor.

### Front-end

`npm install`


## Development Flow

Create 'new_branch' -> Commit -> Push to 'new_branch' -> Open Pull Request 'new_branch' to 'main' -> Code review -> Close PR with squash strategy

## Commits

Commit messages must follow the Conventional Commits: https://www.conventionalcommits.org

## Tests

It uses RSpec, FactoryBot and SimpleCov. Initially, the minimum expected line coverage is 100%, but this can be decreased if a good reason arises.

RSpec Style Guides: https://github.com/rubocop/rspec-style-guide

**Run tests (coverage by default):** `bundle exec rspec`
**Run tests without code coverage:** `COVERAGE=false bundle exec rspec`


## TODOs and Future implementations

- Migrate to PostgreSQL;
- Write frontend and integration tests;
- UI/UX improvements;
- Setup front build and complete deploy;
