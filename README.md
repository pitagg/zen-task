# zen-task
Just another simple task and project manager.

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

## Development Flow

Create 'new_branch' -> Commit -> Push to 'new_branch' -> Open Pull Request 'new_branch' to 'main' -> Code review -> Close PR with squash strategy

## Commits

Commit messages must follow the Conventional Commits: https://www.conventionalcommits.org

## Tests

It uses RSpec, FactoryBot and SimpleCov. Initially, the minimum expected line coverage is 100%, but this can be lowered if a good reason arises.

RSpec Style Guides: https://github.com/rubocop/rspec-style-guide

**Run tests (coverage by default):** `bundle exec rspec`
**Run tests without code coverage:** `COVERAGE=false bundle exec rspec`
