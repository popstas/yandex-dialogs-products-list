#!/bin/bash
set -eu
version="$(cat package.json | grep '"version": "[0-9]' | cut -d':' -f2  | cut -d'"' -f2)"
echo "$version"
sed -i 's/image: popstas\/yandex-dialogs-products-list:.*/image: popstas\/yandex-dialogs-products-list:v'"${version}"'/g' docker-compose.yml
