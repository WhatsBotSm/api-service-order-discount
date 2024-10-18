#################################################################################
#Fecha de Creación:  2024-03-20
#Autor: Carlos Rivas Frutero [crivas@whatsbotsm.com]
#Actualizaciones:
#Versión: 1.0
#################################################################################
FROM node:20.11.1-alpine as production
ENV         TZ                America/Mexico_City
RUN         ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN npm install pm2 -g
#Se asigna el usuario que ejecutará la aplicación
USER node
# Create app directory
WORKDIR /app

ENV NODE_ENV=stagedev
ENV USEFIRESTORE=true
ENV PORT=7004
ENV DB_HOST='192.168.1.65'
ENV DB_NAME='whatsbotsm_dev'
ENV DB_USER='dev3'
ENV DB_PASSWORD='=ZW+Q^cVYW;@N%~'
ENV DB_PORT=5432
ENV BASE_API='/api/descuento/v1'
ENV NUM_REQ_MAX_API=100

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install --omit=dev
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY --chmod=777 . ./

# EXPOSE 8091
# CMD [ "pm2-runtime", "start", "api-service-order-pm2.cjs" ]
CMD [ "npm", "start" ]