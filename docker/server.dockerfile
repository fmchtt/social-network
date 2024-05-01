FROM node:alpine AS build

RUN ls

WORKDIR /build
COPY ./server .

RUN npm install -D
RUN npm run build

FROM node:alpine AS production
WORKDIR /app

COPY --from=build /build/package*.json .
RUN npm install

COPY --from=build /build/dist .
COPY --from=build /build/prisma ./prisma
RUN npx prisma generate

EXPOSE 3000

ENTRYPOINT [ "npm", "run", "production" ]
