#!/usr/bin/env bash

set -e

SCRIPTS_DIR="$(dirname -- "$0")"

BRANCH=production
MODE=production
WORKDIR=zavid
"$SCRIPTS_DIR"/deploy.sh "${BRANCH}" "${WORKDIR}" "${MODE}"
