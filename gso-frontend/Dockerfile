FROM node:16.16.0-alpine AS builder
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.23.1-alpine
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
#/etc/nginx/nginx.conf
EXPOSE 80