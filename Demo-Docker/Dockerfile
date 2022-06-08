FROM node:latest
WORKDIR /src
COPY . .
RUN apt-get update
RUN npm install
EXPOSE 3000 3001 27017
ENTRYPOINT ["node", "index.ts"]