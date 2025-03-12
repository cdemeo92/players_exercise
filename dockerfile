FROM node:lts

WORKDIR /players-exercise

COPY package.json package-lock.json tsconfig.json tsconfig.build.json src ./

RUN npm install && npm run build

CMD ["npm", "run", "start:prod"]