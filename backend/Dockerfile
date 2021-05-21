FROM node:16-alpine
WORKDIR /backend
COPY package.json .
RUN apk --no-cache --virtual build-dependencies add \
    python3 \
    make \
    g++ \
    && yarn install \
    && apk del build-dependencies
COPY src/ .
CMD ["yarn", "run", "dev"]
