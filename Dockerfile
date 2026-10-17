FROM node:22-alpine

COPY package.json .
RUN npm i
COPY . .

CMD [ "npm", "run", "start" ]
