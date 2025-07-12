# Build stage
FROM node:20.19.3-alpine AS builder
WORKDIR /frontend
COPY package.json yarn.lock ./
RUN apk --no-cache --virtual build-dependencies add \
    python3 \
    make \
    g++ \
    && yarn install \
    && apk del build-dependencies
COPY public/ ./public
COPY src/ ./src
RUN yarn build

# Production stage
FROM node:20.19.3-alpine
WORKDIR /frontend
COPY --from=builder /frontend/package.json ./
COPY --from=builder /frontend/yarn.lock ./
COPY --from=builder /frontend/node_modules ./node_modules
COPY --from=builder /frontend/public ./public
COPY --from=builder /frontend/build ./build
CMD ["serve", "-s", "build"]
