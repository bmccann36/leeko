
# Leeko 


this project uses Lerna for monorepo management
`https://github.com/lerna/lerna`

### commands

*run this npm command in specific packages and output show the logs*
`lerna run --scope gqlserver start --stream`

### building a docker container for a package

`lerna clean` (optional)

`docker build -f gqlServer.Dockerfile -t chylomicronman/leekoapiserver .`