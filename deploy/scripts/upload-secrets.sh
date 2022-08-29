#!/usr/bin/env bash

set -e

source ../credentials.env
source ./utils.sh

CODE_DIR="../../code"

scp "$CODE_DIR/.env" "$SSH_USER"@"$SSH_ADDRESS":"/var/www/dev.zavid/code"
scp "$CODE_DIR/.env" "$SSH_USER"@"$SSH_ADDRESS":"/var/www/zavid/code"
echo "NEXTAUTH_URL=https://dev.zavidegbue.com" | ssh "$SSH_USER"@"$SSH_ADDRESS" 'cat > /var/www/dev.zavid/code/.env.local'
echo "NEXTAUTH_URL=https://zavidegbue.com" | ssh "$SSH_USER"@"$SSH_ADDRESS" 'cat > /var/www/zavid/code/.env.local'
