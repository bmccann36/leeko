docker build -f gqlServer.Dockerfile -t chylomicronman/leekoapiserver:{$VERSION} .

docker run -p 4000:4000 \
--env-file packages/gqlServer/.env \
chylomicronman/leekoapiserver 