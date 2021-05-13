#!/bin/bash

IMAGE_NAME=zavid
CONTAINER_NAME=zavid_blog
PORT=4000

git pull

cp ~/config.env .
cp ~/secrets.env .

echo 'Building ZAVID image...'
docker build -f Dockerfile -t $IMAGE_NAME .

if [ $? -eq 0 ]; then
  echo 'Successfully built ZAVID image.'
else
  echo 'Failed to build ZAVID image'
  echo 'Aborting.'
  exit 1
fi

if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
  echo "Destroying $CONTAINER_NAME container..."
  docker stop $CONTAINER_NAME >/dev/null
  docker rm $CONTAINER_NAME >/dev/null
fi

echo 'Running container...'
docker run --detach \
  --name $CONTAINER_NAME \
  --restart unless-stopped \
  --publish $PORT:$PORT \
  $IMAGE_NAME

./notify.sh