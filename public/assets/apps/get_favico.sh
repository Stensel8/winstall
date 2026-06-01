#!/bin/sh

TARGET=$1
if [ -z "$TARGET" ]; then
  echo "Usage: $0 favicon.webp"
  exit 1
fi

# TARGET=favicon.webp
# NAME=favicon
NAME=${TARGET%\.*}
wget --user "splashtop" --password "dcb85fd69cad0dce716fd903990cdaeb" https://staging-api.winstall.app/icons/${NAME}.png
wget --user "splashtop" --password "dcb85fd69cad0dce716fd903990cdaeb" https://staging-api.winstall.app/icons/next/${NAME}.webp

