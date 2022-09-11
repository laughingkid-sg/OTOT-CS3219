# Stage 1 : Builder
FROM node:alpine

RUN mkdir -p /app/backend
WORKDIR /app

COPY backend/src backend/src

WORKDIR /app/backend

COPY backend/package.json .
COPY backend/package-lock.json .
COPY backend/tsconfig.json .

RUN npm ci
RUN npm run build
ENTRYPOINT npm start