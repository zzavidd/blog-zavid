#!/usr/bin/env bash
set -e

BRANCH=$1
WORKDIR=$2
MODE=$3

## Update the project
info 'Checking out project...'
cd "/var/www/${WORKDIR}"
git checkout "$BRANCH"
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"

export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
docker-compose up -d --build "${MODE}"
