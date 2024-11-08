FROM alpine:latest
WORKDIR /app
COPY . .
RUN apk update
RUN apk add --no-cache nodejs yarn
RUN yarn
RUN yarn build
ENTRYPOINT ["yarn", "start"]