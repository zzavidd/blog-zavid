#!/usr/bin/env bash
set -e

BRANCH="production"

if [[ $(git ls-files --exclude-standard --others) ]]; then
  echo "Your working tree is not clean."
  exit 1
fi

if [[ $(git rev-parse --abbrev-ref HEAD) != "$BRANCH" ]]; then
  git checkout $BRANCH
fi

git pull
git rebase main
git push -f origin $BRANCH

git checkout main
