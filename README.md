nCoda
=====

This repository holds the nCoda app itself.

License
-------

All nCoda-provided files are subject to the GNU GPL, version 3 or later. A copy of the license can
be found in the LICENSE file.

Install
-------

You need to install NodeJS and the NPM (Node Package Manager). This may be available through your
distribution's package management system, but you can also download it from the NodeJS website,
https://nodejs.org/ .

Then you need to use NPM to install nCoda's JavaScript dependencies. If this works, it's two simple
commands. From the nCoda root directory, run:

    $ npm install
    $ npm install --dev

Also clone the PyPy.js submodule. From the nCoda root directory, run:

    $ git submodule update

Run
---

Run the development version of nCoda with with ``devserver`` script for Python 3.4+. You can run it
in three ways:

    $ python3 devserver
    ... or...
    $ ./devserver
    ... or...
    $ npm start

Then check out http://localhost:8000 in your browser! It will take noticeable time to load nCoda.
