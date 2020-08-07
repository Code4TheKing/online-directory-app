FROM node:12-alpine AS build
WORKDIR /frontend
COPY package.json yarn.lock ./
RUN yarn install --production
COPY . .
RUN yarn build

FROM nginx:stable-alpine
COPY --from=build /frontend/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
