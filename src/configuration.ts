type Stage = 'dev' | 'prod' | 'integ';

interface Config {
  port: number;
}

const config: Record<Stage, Config> = {
  dev: {
    port: 3000,
  },
  integ: {
    port: 80,
  },
  prod: {
    port: 80,
  },
};

export default () => config[process.env.STAGE as Stage] || config.dev;
