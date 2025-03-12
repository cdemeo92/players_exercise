#!/bin/bash

export STAGE=e2e
export DB_USER=dev_user
export DB_PASSWORD=dev_password
export DB_HOST=mongo

if [ "$(docker ps -aq -f name=mongo_container)" ]; then
  if [ "$(docker ps -aq -f status=exited -f name=mongo_container)" ]; then
    echo "Starting existing container..."
    docker start mongo_container
  else
    echo "Container already running."
  fi
else
  echo "Creating and starting a new container..."
  docker run -d -p 27017:27017 --name mongo_container \
    -e MONGO_INITDB_ROOT_USERNAME=${DB_USER} \
    -e MONGO_INITDB_ROOT_PASSWORD=${DB_PASSWORD} \
    mongo:latest
fi