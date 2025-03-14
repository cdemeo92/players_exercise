#!/bin/bash

if [ "$(docker ps -aq -f name=mongodb)" ]; then
  if [ "$(docker ps -aq -f status=exited -f name=mongodb)" ]; then
    echo "Starting existing container..."
    docker start mongodb
  else
    echo "Container already running."
  fi
else
  echo "Creating and starting a new container..."
  docker run -d -p 27017:27017 --name mongodb \
    -e MONGO_INITDB_ROOT_USERNAME=${DB_USER} \
    -e MONGO_INITDB_ROOT_PASSWORD=${DB_PASSWORD} \
    mongo:latest
fi