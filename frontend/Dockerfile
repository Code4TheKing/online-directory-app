FROM node:14-alpine
WORKDIR /frontend
COPY package.json ./
RUN yarn install
COPY . .
CMD ["yarn", "start"]
