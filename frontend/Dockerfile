FROM node:20.17.0-alpine
WORKDIR /frontend
COPY package.json .
RUN apk --no-cache --virtual build-dependencies add \
    python3 \
    make \
    g++ \
    && yarn install \
    && apk del build-dependencies
COPY public/ .
COPY src/ .
CMD ["yarn", "start"]
