FROM node:lts

WORKDIR /players-exercise

COPY package.json package-lock.json tsconfig.json tsconfig.build.json ./
COPY src ./src

RUN npm install && npm run build

CMD ["npm", "run", "start:prod"]