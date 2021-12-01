FROM node:16-alpine3.11
WORKDIR /app
COPY frontend/package.json .

RUN npm install

COPY frontend/ .

CMD npm run dev