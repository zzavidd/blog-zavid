#!/usr/bin/env bash

set -e

THIS_DIR=$(dirname "$0")
CODE_DIR="$THIS_DIR/../../../code"

source "$THIS_DIR/credentials"

scp "$CODE_DIR/.env" \
  "$CODE_DIR/dkim.key" \
  "$THIS_DIR/.env.test" "$SSH_USER"@"$SSH_ADDRESS":"/var/www/dev.zavid/code"

scp "$CODE_DIR/.env" \
  "$CODE_DIR/dkim.key" \
  "$THIS_DIR/.env.production" "$SSH_USER"@"$SSH_ADDRESS":"/var/www/zavid/code"