#!/usr/bin/env bash

function info {
  echo -e "\033[1;36m[INFO] $1\033[0m"
}

function success {
  echo -e "\033[1;32m[SUCCESS] $1\033[0m"
}

function warn {
  echo -e "\033[1;33m[WARN] $1\033[0m"
}

function error {
  echo -e "\033[1;31m[ERROR] $1\033[0m"
}
