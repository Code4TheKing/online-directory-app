FROM node:16-alpine
WORKDIR /frontend
COPY package.json .
RUN yarn install
COPY public/ .
COPY src/ .
CMD ["yarn", "start"]
