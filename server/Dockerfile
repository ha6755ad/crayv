# build stage
FROM node:lts-alpine as server-stage
WORKDIR /app
COPY . .
RUN rm -rf package-lock.json
RUN rm -rf node_modules; npm install; npm audit fix

## production stage
#FROM nginx:stable-alpine as production-stage
#FROM node:lts-alpine as server-prod
#COPY --from=server-stage . .

EXPOSE 3030

CMD ["npm", "run", "start"]
