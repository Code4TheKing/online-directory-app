# Build stage
FROM node:20.19.3-alpine AS builder
WORKDIR /frontend
COPY package.json .yarnrc yarn.lock ./
RUN apk add --no-cache python3 py3-setuptools make g++ \
	&& yarn install \
	&& apk del python3 py3-setuptools make g++

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
COPY --from=builder /frontend/src ./src

CMD ["yarn", "start"]
