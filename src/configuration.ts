type Stage = 'dev' | 'e2e' | 'prod';

interface Config {
  port: number;
  dbHost: string;
  dbPort: number;
  dbName: string;
  dbUser: string;
  dbPassword: string;
}

const config: Record<Stage, Config> = {
  dev: {
    port: 3000,
    dbHost: 'localhost',
    dbPort: 27017,
    dbName: 'players_dev',
    dbUser: process.env.DB_USER as string,
    dbPassword: process.env.DB_PASSWORD as string,
  },
  e2e: {
    port: 8080,
    dbHost: 'localhost',
    dbPort: 27017,
    dbName: 'players_e2e',
    dbUser: process.env.DB_USER as string,
    dbPassword: process.env.DB_PASSWORD as string,
  },
  prod: {
    port: 80,
    dbHost: 'localhost',
    dbPort: 27017,
    dbName: 'players_prod',
    dbUser: process.env.DB_USER as string,
    dbPassword: process.env.DB_PASSWORD as string,
  },
};

export default () => config[process.env.STAGE as Stage] || config.dev;
