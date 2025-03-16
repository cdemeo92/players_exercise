# Players Exercise

[![semantic-release: 📦🚀](https://img.shields.io/badge/semantic--release-📦🚀-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-blue.svg)](https://conventionalcommits.org)
[![player-exercises:latest](https://img.shields.io/badge/players--exercise-latest-blue?logo=docker)](https://github.com/devclay92/players_exercise/pkgs/container/players_exercise)

## Description

This project provides an API to filter players based on position, birth year range, active status, and club. It also includes a job that allows retrieving all players of a specific club through [transfermarkt-api](https://github.com/felipeall/transfermarkt-api).

## Live demo

This application is built and deployed automatically using the [project's GitHub Actions workflow](https://github.com/devclay92/players_exercise/actions). Every push or merge to the main branch triggers the deployment process.

The application is hosted on Vercel. You can access the API's Swagger documentation at https://players-exercise.vercel.app.

To execute the job that imports players of a specific club id, run the following Docker command using the image deployed in the [project's package registry](https://github.com/devclay92/players_exercise/pkgs/container/players_exercise):

```bash
   $ docker run \
     -e STAGE=prod \
     -e DB_URI="<mongo-uri>" \
     --rm  ghcr.io/devclay92/players_exercise:latest npm run start:job <club-id>
```

The `<mongo-uri>` can be found on the following one-password link: https://share.1password.com/s#Yz_26eKQpwHtCpOn8FEVg6My7HbP99yW8kV6PKRn_3M

## Requirements

- [Node.js](https://nodejs.org/en) >= 20

- npm >= 10

- [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/) (optional for containerized execution)

## Project setup

Clone the repository:

```bash
$ git clone https://github.com/devclay92/players_exercise.git
$ cd players_exercise
```

### Local installation and execution

1. Install dependencies:

   ```bash
   $ npm install
   ```

2. Ensure MongoDB is installed and running. For demo purpouse a mongodb container can be started:

   ```bash
   $ docker run -d \
     --name mongodb-container \
     -p 27017:27017 \
     -e MONGO_INITDB_ROOT_USERNAME=<db-username> \
     -e MONGO_INITDB_ROOT_PASSWORD=<db-password> \
     mongo:latest
   ```

3. Configure the environment variables for db credentials:

   ```bash
   $ export DB_USER=<db-username>
   $ export DB_PASSWORD=<db-password>
   ```

4. Configure the environment variable for [transfermarkt-api](https://github.com/felipeall/transfermarkt-api) domain:

   ```bash
   $ export PROVIDER_DOMAIN=https://transfermarkt-api.fly.dev
   ```

5. Start the application:

   ```bash
   $ npm run start
   ```

### Running with Docker

Build and start the containers with Docker Compose:

```bash
$ docker-compose up --build -d
```

## Usage

Check-out the API spec at http://localhost:3000.

To save players from a club id run the job:

```bash
$ npm run start:job <club-id>
```

or if you are using docker:

```bash
$ docker exec -it player_exercise npm run start:job <club-id>
```

## Environment Variables

| Variable          | Description                                                                                                                                       | Default                 |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `STAGE`           | Set the environment configuration                                                                                                                 | `dev`                   |
| `PORT`            | The port the application listens on (`80` when `STAGE` is `prod`)                                                                                 | `3000`                  |
| `DB_HOST`         | MongoDB server address (Not used when `DB_URI` is present)                                                                                        | `localhost`             |
| `DB_PORT`         | MongoDB server port (Not used when DB_URI is present)                                                                                             | `27017`                 |
| `DB_USER`         | Username for connecting to the MongoDB database (Not used when `DB_URI` is present)                                                               | `none`                  |
| `DB_PASSWORD`     | Password for connecting to the MongoDB database (Not used when `DB_URI` is present)                                                               | `none`                  |
| `DB_URI`          | The MongoDB uri connection string                                                                                                                 | `none`                  |
| `PROVIDER_DOMAIN` | URL of [transfermarkt-api](https://github.com/felipeall/transfermarkt-api) instance (`https://transfermarkt-api.fly.dev/` when `STAGE` is `prod`) | `http://localhost:8000` |

## Run tests

```bash
# unit tests
$ npm run test

# unit tests with coverage
$ npm run test:ci

# integration tests
$ npm run test:integ

# e2e tests NOTE: it will start a mongodb container
$ npm run test:e2e
```

## Useful Commands

| Command                  | Description                                                   |
| ------------------------ | ------------------------------------------------------------- |
| `npm run build`          | Compiles the project for production                           |
| `npm run start`          | Starts the app                                                |
| `npm run start:dev`      | Starts the app in development mode with live-reload           |
| `npm run start:debug`    | Starts the app in development mode with live-reload and debug |
| `npm run start:prod`     | Starts the app in production mode                             |
| `npm run start:job`      | Start the job to save players of a given club id              |
| `npm run start:job:prod` | Start the job to save players in production mode              |
| `npm run lint`           | Runs eslint and automatically fixes errors                    |
| `npm run test`           | Runs tests                                                    |
| `npm run test:watch`     | Runs tests in watch mode                                      |

## Author

[Claudio De Meo](https://www.linkedin.com/in/claudio-de-meo-6a746412b/)
