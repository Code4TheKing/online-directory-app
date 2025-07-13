# Build stage
FROM node:20.19.3-alpine AS builder
WORKDIR /backend
COPY package.json yarn.lock ./
RUN yarn install

COPY src/ ./src
COPY webpack.functions.js ./
COPY netlify.toml ./
RUN yarn build

# Production stage
FROM node:20.19.3-alpine
WORKDIR /backend
COPY --from=builder /backend/package.json ./
COPY --from=builder /backend/yarn.lock ./
COPY --from=builder /backend/node_modules ./node_modules
COPY --from=builder /backend/src ./src

CMD ["yarn", "start"]
