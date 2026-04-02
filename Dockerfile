FROM node:24
WORKDIR /src
COPY package*.json ./
RUN npm install --build-from-source=sqlite3
COPY . .
RUN npm run build
RUN npm rebuild sqlite3 --build-from-source
EXPOSE 3000
CMD ["npm", "start"]