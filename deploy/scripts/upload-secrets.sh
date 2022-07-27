#!/usr/bin/env bash

set -e

source ../.env
source ./utils.sh

CODE_DIR="../../code"

# TODO: Add prod "zavid"
for domain in zavid dev.zavid; do
  scp \
    "$CODE_DIR/.env" \
    "$CODE_DIR/.env.local" \
    "$SSH_USER"@"$SSH_ADDRESS":"/var/www/$domain/code"
done
