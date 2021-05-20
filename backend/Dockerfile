FROM node:16-alpine
WORKDIR /backend
COPY package.json ./
RUN yarn install
COPY . .
CMD ["yarn", "run", "dev"]
