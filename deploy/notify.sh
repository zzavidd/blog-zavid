#!/bin/bash

set -e

file=secrets.env

# Retrieve token from config.env
token=$(grep TELEGRAM_JENKINS_TOKEN $file | cut -d '=' -f 2-)
chat_id=$(grep TELEGRAM_JENKINS_CHAT_ID $file | cut -d '=' -f 2-)

# Send message to Telegram
status_code=$(
  curl -X POST \
    --silent \
    --output /dev/null \
    --write-out "%{http_code}" \
    -H 'Content-Type: application/json' \
    -d "{\"chat_id\": $chat_id, \"text\": \"&#128994; ZAVID: Docker container built and started successfully.\", \"parse_mode\": \"HTML\"}" \
    "https://api.telegram.org/bot$token/sendMessage"
)

if [ $status_code == 200 ]; then
  echo "Notification sent."
else
  echo "Failed to send notification."
fi
