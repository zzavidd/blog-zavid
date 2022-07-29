#!/usr/bin/env bash

CWD="$(dirname -- "$0")"

# shellcheck source=/dev/null
source "$CWD"/utils.sh

if [ "$1" == "dev" ]; then
  warn "Building for staging."
  IMAGE_NAME='zavid-dev'
  CONTAINER_NAME='zavid_blog_staging'
  PORT='3333'
  WORKDIR='dev.zavid'
  NODE_ENV='staging'
else
  warn 'Building for production.'
  IMAGE_NAME='zavid'
  CONTAINER_NAME='zavid_blog'
  PORT='4000'
  WORKDIR='zavid'
  NODE_ENV='production'
fi

info "Building '$IMAGE_NAME' image..."
if
  docker build -f "$CWD/../Dockerfile" \
    -t $IMAGE_NAME \
    --build-arg NODE_ENV="$NODE_ENV" \
    --build-arg PORT="$PORT" \
    --build-arg WORKDIR="$WORKDIR" \
    .
then
  success "Successfully built '$IMAGE_NAME' image."
else
  error "Failed to build '$IMAGE_NAME' image"
  error 'Aborting.'
  exit 1
fi

if docker ps -q -f name=$CONTAINER_NAME; then
  warn "Destroying $CONTAINER_NAME container..."
  docker stop $CONTAINER_NAME >/dev/null
  docker rm $CONTAINER_NAME >/dev/null
fi

info 'Running container...'
docker run --detach \
  --name $CONTAINER_NAME \
  --restart on-failure:5 \
  --publish $PORT:$PORT \
  --env PORT=$PORT \
  $IMAGE_NAME
