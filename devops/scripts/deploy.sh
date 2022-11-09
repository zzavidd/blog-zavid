#!/usr/bin/env bash
set -e

source "$(dirname -- "$0")"/utils.sh

BRANCH=$1
WORKDIR=$2
MODE=$4
NGINX_CONF_SRC="/var/www/${WORKDIR}/devops/$3"
NGINX_CONF_DEST="/etc/nginx/sites-available/${WORKDIR}egbue.com"

## Update the project
info 'Checking out project...'
cd "/var/www/${WORKDIR}"
git checkout "$BRANCH"
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"

## Update nginx.conf
function copyNginxFiles {
  cp "${NGINX_CONF_SRC}" "${NGINX_CONF_DEST}"
  ln -sf "${NGINX_CONF_DEST}" /etc/nginx/sites-enabled/

  if sudo nginx -t; then
    success 'Restarting Nginx...'
    sudo service nginx restart
    rm -rf "${NGINX_CONF_DEST}-copy"
  else
    warn 'Reverting copied configuration...'
    mv "${NGINX_CONF_DEST}-copy" "${NGINX_CONF_DEST}"
  fi
}

if [ -e "${NGINX_CONF_DEST}" ]; then
  HASH_SRC=$(md5sum "${NGINX_CONF_SRC}" | awk '{print $1;}')
  HASH_DEST=$(md5sum "${NGINX_CONF_DEST}" | awk '{print $1;}')

  if [ "$HASH_SRC" != "$HASH_DEST" ]; then
    warn 'Nginx configuration has changed. Copying files...'
    cp "${NGINX_CONF_DEST}" "${NGINX_CONF_DEST}-copy"
    copyNginxFiles
  else
    success 'No changes to nginx configuration. Skipping copy.'
  fi
else
  warn 'No nginx configuration exists at destination. Copying files...'
  copyNginxFiles
fi

cd "/var/www/${WORKDIR}"
docker-compose -f ./devops/docker-compose.yml build "${MODE}"
docker-compose -f ./devops/docker-compose.yml rm --stop --force -v "${MODE}"
docker-compose -f ./devops/docker-compose.yml up --detach "${MODE}"
