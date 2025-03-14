type Stage = 'dev' | 'e2e' | 'prod';

interface Config {
  port: number;
  dbHost: string;
  dbPort: number;
  dbName: string;
  dbUser: string;
  dbPassword: string;
  collectionName: string;
  providerDomain: string;
}

const config: Record<Stage, Config> = {
  dev: {
    port: 3000,
    dbHost: (process.env.DB_HOST as string) ?? 'localhost',
    dbPort: 27017,
    dbName: 'players_dev',
    dbUser: process.env.DB_USER as string,
    dbPassword: process.env.DB_PASSWORD as string,
    collectionName: 'players',
    providerDomain: 'http://localhost:8000',
  },
  e2e: {
    port: 8080,
    dbHost: (process.env.DB_HOST as string) ?? 'localhost',
    dbPort: 27017,
    dbName: 'players_e2e',
    dbUser: process.env.DB_USER as string,
    dbPassword: process.env.DB_PASSWORD as string,
    collectionName: 'players',
    providerDomain:
      (process.env.PROVIDER_DOMAIN as string) ?? 'http://localhost:8000',
  },
  prod: {
    port: 80,
    dbHost: process.env.DB_HOST as string,
    dbPort: 27017,
    dbName: 'players_prod',
    dbUser: process.env.DB_USER as string,
    dbPassword: process.env.DB_PASSWORD as string,
    collectionName: 'players',
    providerDomain: 'https://transfermarkt-api.fly.dev',
  },
};

export default (): Config => config[process.env.STAGE as Stage] || config.dev;
