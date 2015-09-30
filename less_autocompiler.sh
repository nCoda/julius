#!/usr/bin/env bash

# do an initial compile
node_modules/less/bin/lessc --clean-css $1 $2

# now set up the file-watch
while inotifywait -e modify -qq $1
do
    node_modules/less/bin/lessc --clean-css $1 $2
done
