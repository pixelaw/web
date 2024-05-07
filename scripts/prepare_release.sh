#!/bin/bash
set -euxo pipefail

if [ ! -f VERSION ]; then
    echo "VERSION file does not exist"
    exit 1
fi

if [ $# -eq 0 ]; then
    echo "No arguments supplied"
    exit 1
fi

prev_version=$(cat VERSION)
next_version=$1

# Update package.json
sed -i'' -e "s/"version": "$prev_version"/"version": "$next_version"/g" package.json

# Update README.md
sed -i'' -e "s/Version $prev_version/Version $next_version/g" README.md

#echo $1 > VERSION
#
## Uncommented git commands
#git commit -am "Prepare v$1"
#git tag -a "v$1" -m "Version $1"

