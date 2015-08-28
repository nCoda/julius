#! /bin/bash
while inotifywait -e modify -qq $1
do
    node_modules/less/bin/lessc --clean-css $1 $2
done
