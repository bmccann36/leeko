

FROM node:13.12.0
WORKDIR /usr/src/leekoServer

COPY lerna.json ./lerna.json
COPY package*.json ./
COPY packages/gqlServer/package*.json ./packages/gqlServer/
COPY packages/awsUtils/package*.json ./packages/awsUtils/
COPY packages/utils/package*.json ./packages/awsUtils/

RUN npm install

# Bundle app source
COPY packages/awsUtils ./packages/awsUtils
COPY packages/gqlServer ./packages/gqlServer
COPY packages/utils ./packages/utils

RUN npm run bootstrap

RUN cd packages/gqlServer && npm i

EXPOSE 4000

CMD  [ "sh", "-c", "npm run gqlServer" ]