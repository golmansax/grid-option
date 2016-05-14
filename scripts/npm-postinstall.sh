#!/bin/bash

npm prune

if [ "$NODE_ENV" == "production" ]; then
  npm run build
fi
