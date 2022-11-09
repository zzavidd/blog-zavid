#!/usr/bin/env bash

set -e

SCRIPTS_DIR="$(dirname -- "$0")"

BRANCH=main
WORKDIR=dev.zavid
NGINX_CONF=nginx.dev.conf
"$SCRIPTS_DIR"/deploy.sh "${BRANCH}" "${WORKDIR}" "${NGINX_CONF}"

## Run the docker script from project
cd "/var/www/${WORKDIR}"
docker-compose -f "$SCRIPTS_DIR/../docker-compose.yml" up -d --build staging
