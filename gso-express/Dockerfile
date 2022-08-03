FROM node:16.16.0-alpine AS builder
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:16.16.0-alpine
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install --omit=dev
COPY --from=builder /usr/src/app/dist ./dist
EXPOSE 4000
CMD npm start