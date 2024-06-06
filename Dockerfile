FROM node:18

WORKDIR /src
COPY /src/package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD npm run dev