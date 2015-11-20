#!/usr/bin/env bash
#
# Call this script with three arguments:
# 1: a shell path to watch for updates
# 2: the LESS file to compile
# 3: the path to output a CSS file
#
# Arguments 1 and 2 can be the same, but they may be different. This is intended for watching a
# directory of files, all of which are pulled into a single LESS file with @include directives.
#
# Example:
# ./less_autocompiler.sh css/*.less css/main.less css/main.css
#

# do an initial compile
node_modules/less/bin/lessc --clean-css $2 $3

# now set up the file-watch
while inotifywait -e modify -qq $1
do
    node_modules/less/bin/lessc --clean-css $2 $3
done
