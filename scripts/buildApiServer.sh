docker build -t chylomicronman/leekoapiserver .

docker run -p 4000:4000 \
--env-file packages/gqlServer/.env \
chylomicronman/leekoapiserver 