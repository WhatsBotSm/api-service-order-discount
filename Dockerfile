FROM node:20.11.1-alpine AS linter
ENV HUSKY_SKIP_INSTALL=1
ENV TZ=America/Mexico_City
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
USER node
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY --chmod=777 . ./

FROM node:20.11.1-alpine AS production
ENV HUSKY_SKIP_INSTALL=1
ENV TZ=America/Mexico_City
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
USER node
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev --ignore-scripts
COPY --chmod=777 . ./
CMD [ "npm", "start" ]