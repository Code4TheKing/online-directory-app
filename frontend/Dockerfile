FROM node:16-alpine
WORKDIR /frontend
COPY package.json ./
RUN yarn install
COPY . .
CMD ["yarn", "start"]
