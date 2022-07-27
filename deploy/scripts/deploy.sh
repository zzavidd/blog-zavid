#!/usr/bin/env bash
set -e

source "$(dirname -- "$0")"/utils.sh

BRANCH=$1
WORKDIR=$2
NGINX_CONF_SRC=$3

## Update the project
info 'Checking out project...'
cd "/var/www/${WORKDIR}"
git checkout "$BRANCH"
git pull origin "$BRANCH"

## Update nginx.conf
function copyNginxFiles {
  cp "./deploy/${NGINX_CONF_SRC}" "${NGINX_CONF_DEST}"
  ln -sf "${NGINX_CONF_DEST}" /etc/nginx/sites-enabled/
  sudo nginx -t
  sudo service nginx restart
}

NGINX_CONF_DEST="/etc/nginx/sites-available/${WORKDIR}egbue.com"
if [ -e "$NGINX_CONF_DEST" ]; then
  HASH_SRC=$(md5sum "${NGINX_CONF_SRC}" | awk '{print $1;}')
  HASH_DEST=$(md5sum "${NGINX_CONF_DEST}" | awk '{print $1;}')

  if [ "$HASH_SRC" -ne "$HASH_DEST" ]; then
    warn 'Nginx configuration has changed. Copying files...'
    copyNginxFiles
  else
    success 'No changes to nginx configuration. Skipping copy.'
  fi
else
  warn 'No nginx configuration exists at destination. Copying files...'
  copyNginxFiles
fi
