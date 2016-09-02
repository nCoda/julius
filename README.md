# Julius #

[![CircleCI](https://circleci.com/gh/nCoda/julius.svg?style=svg)](https://circleci.com/gh/nCoda/julius)

This repository holds Julius, the user interface, and the nCoda app itself.

## License ##

All nCoda-provided files are subject to the GNU GPL, version 3 or later. A copy of the license can
be found in the LICENSE file.

## Install ##

You need to install NodeJS and the NPM (Node Package Manager). This may be available through your
distribution's package management system, but you can also download it from the NodeJS website,
https://nodejs.org/ .

Then you need to use NPM to install nCoda's JavaScript dependencies. If this works, it's two simple
commands. From the nCoda root directory, run:

    $ npm install
    $ npm dedupe

***Note:*** You should re-run these commands after you run ``git pull``.

The first command installs Julius' dependencies, and the second tries to factor out common
dependencies between the installed dependencies.

We recommend running the automated test suites before starting development.

## Optional: Install Watchman ##

The "devserver" script used to compile and run *Julius* takes advantage of the *Watchman* program
to automatically recompile the LESS files when they are changed. Installing *Watchman* is optional.
The "devserver" script will detect and use *Watchman* if it can be found by the *which* command.

https://facebook.github.io/watchman/docs/install.html#build-install

You must use the ``--with-python`` flage for the ``./configure`` script in order to build the Python
extension. After you build, switch into the "python" subdirectory and run
``sudo python2 setup.py install`` to install the Python extension.

We strongly recommend the ``--enable-stack-protector`` flag for the ``./configure`` script for all
users. This adds several compiler flags that eliminate a common set of memory management bugs.

If you do not install *Watchman*, you must restart the "devserver" script or run ``lessc`` yourself
in order to recompile the LESS files.

## Install Fujian and Lychee ##

Most Julius functionality requires a data source, for which nCoda's *Lychee* is the only known solution.

Clone the *Lychee* repository into a directory *other than* the the Julius directory, then follow
the installation instructions in the *Lychee* README file. At the end of the installation process
you should have these top-level directories all beside each other:

- julius
- lychee
- fujian

The *Lychee* repository URL is git@jameson.adjectivenoun.ca:lychee/lychee.git

## Run nCoda ##

***Important:*** Start *Fujian* before you start *Julius*.

Open two terminal windows. In one window, activate the Fujian/Lychee virtualenv, then start *Fujian*
by running ``python -m fujian``.

In the other window, run the development version of nCoda with with ``devserver`` script for
Python 3.4+. You can run it in three ways:

```bash
$ python3 devserver
# ... or...
$ ./devserver
# ... or...
$ npm start
```

Then visit http://localhost:8000 in your browser! It will take noticeable time to load nCoda.

## Run the Test Suites ##

Run the *Julius* test suite with the ``npm test`` command. Run the *Lychee* and *Fujian* test suites
with the ``py.test`` command. All test commands must be issued from the project's respective directory.

## Development Workflow ##

Once you start *Lychee* and *Julius* in the way described above, the JavaScript files will be
recompiled automatically when you save them. However, you can also recompile the CSS files
automatically by installing the *Watchman* program as described above. If it is installed properly
on your system (i.e., if it can be found with the *which* command) then *Watchman* will be found and
used without specific configuration.

## Troubleshooting Problems ##

It's a computer program, so sometimes it's just not going to work.

### Cannot run lessc ###

When you run ``devserver`` you may see an error like this:

```bash
./less_autocompiler.sh: line 4: node_modules/less/bin/lessc: Permission denied
```

This probably means that ``lessc`` was installed without the "executable" bit set. I don't know why
they would ship an executable that can't be executed, but it happens. To see whether this is the
problem, use ``ls``:

```bash
$ ls -l node_modules/less/bin/lessc
total 16
-rw-r--r-- 1 crantila crantila 16197 Sep 25 02:43 lessc
```

It shouldn't say "crantila" unless that's your username. But look at the permissions: ``-rw-r--r--``.
This should be ``-rwxr-xr-x`` so you need to fix it. Do this:

```bash
$ chmod +x node_modules/less/bin/lessc
```

Try running ``devserver`` again, and that error message should disappear.

## Directory Structure ##

The "js" directory of the Julius repository is subdivided into three:

1. The "nuclear" directory holds NuclearJS stores, getters, and so on, which manage data flow.
1. The "react" directory holds React components, which constitute the user interface.
1. The "util" directory holds other modules, for tasks such as logging and connecting to Fujian.

Tests for a module belong in a subdirectory of that module. For example, the tests for
``js/nuclear/getters.js`` are in ``js/nuclear/tests/getters.js``.
