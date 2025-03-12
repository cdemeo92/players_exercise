FROM node:lts

WORKDIR /players-exercise

COPY package.json package-lock.json ./
RUN npm install

COPY src ./src

CMD ["npm", "run", "start:prod"]