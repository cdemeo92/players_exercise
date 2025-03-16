type Stage = 'dev' | 'prod';

interface Config {
  port: number;
  dbHost: string;
  dbPort: number;
  dbName: string;
  dbUser: string;
  dbPassword: string;
  dbUri?: string;
  collectionName: string;
  providerDomain: string;
}

const config: Record<Stage, Config> = {
  dev: {
    port: parseInt(process.env.PORT as string) || 3000,
    dbHost: (process.env.DB_HOST as string) ?? 'localhost',
    dbPort: parseInt(process.env.DB_PORT as string) || 27017,
    dbName: 'players',
    dbUser: process.env.DB_USER as string,
    dbPassword: process.env.DB_PASSWORD as string,
    dbUri: process.env.DB_URI as string,
    collectionName: 'players',
    providerDomain:
      (process.env.PROVIDER_DOMAIN as string) ?? 'http://localhost:8000',
  },
  prod: {
    port: 80,
    dbHost: process.env.DB_HOST as string,
    dbPort: 27017,
    dbName: 'players',
    dbUser: process.env.DB_USER as string,
    dbPassword: process.env.DB_PASSWORD as string,
    dbUri: process.env.DB_URI as string,
    collectionName: 'players',
    providerDomain: 'https://transfermarkt-api.fly.dev',
  },
};

export default (): Config => config[process.env.STAGE as Stage] || config.dev;
