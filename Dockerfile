FROM node:12-alpine3.12
WORKDIR /backend
COPY . .
RUN npm i && npm run prebuild && npm run build
CMD ["npm", "run", "start:prod"]