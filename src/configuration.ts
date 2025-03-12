type Stage = 'dev' | 'e2e' | 'prod';

interface Config {
  port: number;
}

const config: Record<Stage, Config> = {
  dev: {
    port: 3000,
  },
  e2e: {
    port: 8080,
  },
  prod: {
    port: 80,
  },
};

export default () => config[process.env.STAGE as Stage] || config.dev;
