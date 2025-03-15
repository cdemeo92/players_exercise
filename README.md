# Players Exercise

[![semantic-release: 📦🚀](https://img.shields.io/badge/semantic--release-📦🚀-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-blue.svg)](https://conventionalcommits.org)

## Description

This project provides an API to filter players based on position, birth year range, active status, and club. It also includes a job that allows retrieving all players of a specific club through [transfermarkt-api](https://github.com/felipeall/transfermarkt-api).

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

4. Configure the environment [transfermarkt-api](https://github.com/felipeall/transfermarkt-api) domain:

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

## Environment Variables

| Variable          | Description                                                                         | Default                 |
| ----------------- | ----------------------------------------------------------------------------------- | ----------------------- |
| `PORT`            | The port the application listens on                                                 | `3000`                  |
| `DB_HOST`         | MongoDB server address                                                              | `localhost`             |
| `DB_PORT`         | MongoDB server port                                                                 | `27017`                 |
| `DB_USER`         | Username for connecting to the MongoDB database                                     | `none`                  |
| `DB_PASSWORD`     | Password for connecting to the MongoDB database                                     | `none`                  |
| `PROVIDER_DOMAIN` | URL of [transfermarkt-api](https://github.com/felipeall/transfermarkt-api) instance | `http://localhost:8000` |

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
