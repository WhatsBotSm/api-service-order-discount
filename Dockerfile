FROM node:20.11.1-alpine AS linter
ENV TZ=America/Mexico_City
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN npm install pm2 -g
USER node
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY --chmod=777 . ./

FROM node:20.11.1-alpine AS production
ENV TZ=America/Mexico_City
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN npm install pm2 -g
USER node
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --chmod=777 . ./
#CMD [ "pm2-runtime", "start", "api-service-order-pm2.cjs" ]
CMD [ "npm", "start" ]