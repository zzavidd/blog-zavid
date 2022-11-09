#!/usr/bin/env bash

set -e

SCRIPTS_DIR="$(dirname -- "$0")"

BRANCH=main
MODE=staging
WORKDIR=dev.zavid
NGINX_CONF=nginx.dev.conf
"$SCRIPTS_DIR"/deploy.sh "${BRANCH}" "${WORKDIR}" "${NGINX_CONF}" "${MODE}"