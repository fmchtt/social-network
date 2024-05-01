FROM node:alpine AS frontend-build
WORKDIR /app
COPY ./client .

RUN npm install
RUN npm run build

FROM nginx:latest

COPY ./docker/social-network.conf /etc/nginx/nginx.conf
COPY --from=frontend-build /app/dist/client/browser /wwwroot
