FROM node:13.12.0
WORKDIR /usr/src/leekoServer

# need to copy both packages since awsUtils is a dependency
# (and bc I'm a dummy)
COPY gqlServer/package*.json ./gqlServer/
COPY awsUtils/package*.json ./awsUtils/

RUN cd gqlServer && npm install
RUN cd awsUtils && npm install

# Bundle app source
COPY awsUtils ./awsUtils
COPY gqlServer ./gqlServer

EXPOSE 4000

CMD  [ "sh", "-c", "node gqlServer/lib/index.js" ]