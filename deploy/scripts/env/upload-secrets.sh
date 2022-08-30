#!/usr/bin/env bash

set -e

THIS_DIR=$(dirname "$0")
CODE_DIR="$THIS_DIR/../../../code"

source "$THIS_DIR/credentials"

scp "$CODE_DIR/.env" "$SSH_USER"@"$SSH_ADDRESS":"/var/www/dev.zavid/code"
# scp "$CODE_DIR/.env" "$SSH_USER"@"$SSH_ADDRESS":"/var/www/zavid/code"

scp "$THIS_DIR/.env.staging" "$SSH_USER"@"$SSH_ADDRESS":"/var/www/dev.zavid/code/.env.local"
# scp "$THIS_DIR/.env.production" "$SSH_USER"@"$SSH_ADDRESS":"/var/www/zavid/code/.env.local"