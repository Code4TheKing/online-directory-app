FROM node:12-alpine
WORKDIR /backend
COPY package.json yarn.lock ./
RUN yarn install --production
COPY . .
CMD ["yarn", "start"]
