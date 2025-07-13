# Build stage
FROM node:22.17.0-alpine AS builder
WORKDIR /backend
COPY package.json yarn.lock ./
RUN apk --no-cache --virtual build-dependencies add \
    python3 \
    make \
    g++ \
    && yarn install \
    && apk del build-dependencies
COPY src/ ./src
RUN yarn build

# Production stage
FROM node:22.17.0-alpine
WORKDIR /backend
COPY --from=builder /backend/package.json ./
COPY --from=builder /backend/yarn.lock ./
COPY --from=builder /backend/node_modules ./node_modules
COPY --from=builder /frontend/build ./build
CMD ["serve", "-s", "build"]
