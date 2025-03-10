type Stage = 'dev' | 'prod';

interface Config {
  port: number;
}

const config: Record<Stage, Config> = {
  dev: {
    port: 3000,
  },
  prod: {
    port: 80,
  },
};

export default () => config[process.env.STAGE as Stage] || config.dev;
