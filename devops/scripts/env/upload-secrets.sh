#!/usr/bin/env bash

set -e

THIS_DIR=$(dirname "$0")
CODE_DIR="$THIS_DIR/../../../code"

source "$THIS_DIR/credentials"

environments=("staging" "production")
target_directories=(
  "/var/www/dev.zavid/code"
  "/var/www/zavid/code"
)

for ((i = 0; i < ${#environments[@]}; i++)); do
  environment="${environments[i]}"
  target_directory="${target_directories[i]}"

  tmp_file="$THIS_DIR/.env"

  cat "$CODE_DIR/.env" > "$tmp_file"
  echo >> "$tmp_file"
  cat "$THIS_DIR/$environment/.env.local" >> "$tmp_file"
  scp "$tmp_file" "$SSH_USER"@"$SSH_ADDRESS":"$target_directory"
  rm -rf "$tmp_file"
done