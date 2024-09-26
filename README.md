# Zen Task
The simple project management tool. :)

[![CI](https://github.com/pitagg/zen-task/actions/workflows/ci.yml/badge.svg)](https://github.com/pitagg/zen-task/actions/workflows/ci.yml)

> [!IMPORTANT]
> This project is still in progress. Feel free to explore it, be patient though.


## Setup and running

### Back-end

**Install dependencies:**

The API was built in `ruby-3.3.4` with `Rails 7.2` so firstly install this ruby version in your preferred way.
To set the project up, clone the respository, open the folder `zen-task`in your terminal, run `gem install bundler` and `bundle install` to install all gems.

**Setup database:**

Beyond the migrations, some seeds where implemented so you don't need to wast time creating records in the database.
To setup the database, just run `bundle exec rails db:prepare` to create the database, apply schema and run all seeds.

> [!TIP]
> `db:prepare` is idempotent, so it will only perform the necessary tasks once. If a reset is necessary, use `db:setup` instead, which will cleanup and rebuild the database. Use it carefully!

**Master Key:**

For security reasons the file `credentials.yml` is encrypted with a secret master key, which must be in the `/config` folder. This master key can't be exposed in the repository, so if you didn't receive the file, just ask for it.

After saving the master key in the config folder, the following code must successfully decript and open `credentials.yml` for edition. It's a good way to make sure it's all set:

```
VISUAL="code --wait" bundle exec rails credentials:edit
```

> [!TIP]
> You can replace `code` with your preferred editor.

**Start server**

All set! Just run `bundle exec rails s` to start the server. Check out the Thunder/Postam request collections at `docs/api-requests/` to get usage examples of the API.


### Front-end

The front-end is a React SPA (version `^18.3.1`) built inside the rails project in the folder `frontend`.
To start it, firstly open a new tab in your terminal and go to the frontend folder with `cd zen-task/frontend/` and then install its dependencies with `npm install`.

If is everything ok, you are ready to run `npm start`. A new tab will be open in your browser on `http://localhost:3001/`. Have fun!


## Development Flow

This is a quick explanation of the development flow adopted during this project for each new implementation:

- Create a new branch with a descritive name (e.g., `feat-activities`);
- Make small changes and commit them;
- Push to the feature branch;
- Open a Pull Request to 'main';
- Ask for Code Review, have rich discussions and make the world better (unfortunately I didn't have this step);
- Close PR with `squash` strategy, as it keeps the history much more clean, feature focused and easy to revert if necessary.

### Commits

Commit messages must follow the Conventional Commits: https://www.conventionalcommits.org.
The squash commits, when merging the PRs, must follow the same rules.

## Code Quality

This project uses RSpec, FactoryBot and SimpleCov to ensure tha everything is working well.
For now, the line coverage is 100% which is great, but a litle decreasing can be accepted if a good reason arises.

RSpec Style Guides: https://github.com/rubocop/rspec-style-guide

**Run tests with coverage:**

Coverage is active by default, so just run `bundle exec rspec` to run all tests and generate the coverage report.
After complete it, just open the `/coverage/index.html` in your brower to see the report.


**Run tests without code coverage:**

To disable the SimpleCov report, just pass the env `COVERAGE=false` to the rspec command: `COVERAGE=false bundle exec rspec`.


## General feature information

- Authentication with JWT (POST /login with email and password).
- Route /me to check logged user data (GET /me with header Authorization + JWT).
- JWT expires in 24 hours.
- Activity end_date is updated to the current date when it's marked as completed.
- API versioning: `/api/v1/...`. Requests examples at `docs/api-requests/` in both Thunder and Postam collections.


## TODOs and Future implementations

- Migrate to PostgreSQL;
- Write frontend and integration tests;
- UI/UX improvements;
- Setup front build and complete deploy;
- Handle pagination on Projects and Acitivites list.
- Considere peformance improvents for the completion calculations. Both values are persisted in the database to avoid problems with performance, but a couple of improvements could be considered in the future, such as:
    - Move the calculations to a background job to avoid affecting user experience when saving the activity;
    - Move the values to a cache (Redis) as they get much more writing operations.
