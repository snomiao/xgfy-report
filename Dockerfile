FROM node

WORKDIR /app

ADD package*.json ./
RUN npm ci

# ADD src src
# RUN mkdir lib

ADD lib lib
# RUN npm run build

# ADD .env /app/
ENV NODE_ENV=production
USER node
EXPOSE 3000

CMD [ "npm", "run", "start"]
