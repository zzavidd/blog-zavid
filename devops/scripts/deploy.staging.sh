#!/usr/bin/env bash

set -e

SCRIPTS_DIR="$(dirname -- "$0")"

BRANCH=main
MODE=staging
WORKDIR=dev.zavid
"$SCRIPTS_DIR"/deploy.sh "${BRANCH}" "${WORKDIR}" "${MODE}"
