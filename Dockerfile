FROM node

WORKDIR /app
ADD package*.json ./
RUN npm ci
# ADD src src
# RUN npm run build
ADD .env /app/
ADD lib lib
ENV NODE_ENV=production
USER node
EXPOSE 3000
CMD [ "node", "lib/index.js" ]
