// ncoda-init.js
// This initializes nCoda.
// Copyright 2015 Christopher Antila


import React from "react";
import {Julius} from "./julius/julius.src.js";
import StructureView from './julius/structure_view.src.js';


// PyPy.js stuff --------------------------------------------------------------

// PyPy.js doesn't buffer its stderr, so we'll do it.
var _stderr_buffer = [];

// Set up the stuff needed for the PyPy.js REPL
var _pyromise = null;  // holds the Promise that PyPy.js will ask for
var _pypyjsResolver = null;  // holds the resolve() function for that Promise
var _makePyromise = function() {
    _pyromise = new Promise(function(resolve, reject) {
        // TODO: what happens with "reject"????
        _pypyjsResolver = resolve;
    });
};
_makePyromise();  // must be sure to setup a Promise right away!

var pypyjsComms = {
    // This object has members that manage communication with PyPy.js.
    // Specifically, it has functions for "stdin," "stdout," and "stderr".
    stdin: function(suite) {
        // This function submits a new suite to PyPy.js.
        if ("" !== suite || undefined !== suite) {
            pypyjsComms._outputTheInput(suite);
            _pypyjsResolver(suite);
            _makePyromise();
        }
    },
    _outputTheInput: function(suite) {
        renderNCoda({sendToConsole: suite, sendToConsoleType: "input"});
    },
    stdout: function(message) {
        renderNCoda({sendToConsole: message, sendToConsoleType: "stdout"});
    },
    stderr: function(message) {
        // PyPy.js doesn't buffer its stderr, so we'll do it.
        _stderr_buffer.push(message);
        if (message === "\n" || _stderr_buffer.length >= 128) {
            renderNCoda({sendToConsole: _stderr_buffer.join(""), sendToConsoleType: "stderr"});
            _stderr_buffer = [];
        }
    }
};


// hook up the "pypyjsComms" functions
pypyjs.stdout = pypyjsComms.stdout;
pypyjs.stderr = pypyjsComms.stderr;


// nCoda Interface Stuff ------------------------------------------------------

var renderNCoda = function(params) {
    // The top-level function to render nCoda with React.
    //
    // @param params (object): With all the props that might be sent to the NCoda component.
    //     - meiForVerovio (string): an MEI file that Verovio will render
    //
    // This function can be called from Python:
    // >>> import js
    // >>> js.globals['renderNCoda']()

    // prepare the props
    var props = {submitToPyPy: pypyjsComms.stdin, submitToLychee: submitToLychee};

    if (undefined !== params) {
        if (params.meiForVerovio) {
            var zell = '\<\?xml version=\"1.0\" encoding=\"UTF-8\"\?\>\n' + params.meiForVerovio;
            props.meiForVerovio = zell;
        }
        if (params.sendToConsole) {
            props.sendToConsole = params.sendToConsole;
        }
        if (params.sendToConsoleType) {
            props.sendToConsoleType = params.sendToConsoleType;
        }
    }

    // do the render
    React.render(
        React.createElement(Julius, props),
        document.getElementById("ncoda")
    );
};


// Lychee Stuff ---------------------------------------------------------------

var submitToLychee = function(lilypondCode) {
    // When given some LilyPond code, this function submits it to PyPy.js as a call to Lychee.
    //
    // @param lilypondCode (str): The LilyPond code to submit to Lychee.

    // NOTE: Lychee's Document.__init__() currently creates the "testrepo" directory for us

    var code =    "import lychee\n"
                + "from lychee import signals\n"
                + "from lychee.signals import outbound\n"
                + "from xml.etree import ElementTree as etree\n"
                + "import js\n"
                + "\n"
                + "_MEINS = '{http://www.music-encoding.org/ns/mei}'\n"
                + "_MEINS_URL = 'http://www.music-encoding.org/ns/mei'\n"
                + "\n"
                + "def mei_listener(**kwargs):\n"
                + "    outbound.I_AM_LISTENING.emit(dtype='mei')\n"
                + "\n"
                + "def mei_through_verovio(dtype, placement, document, **kwargs):\n"
                + "   if 'mei' != dtype:\n"
                + "       return\n"
                + "   output_filename = 'testrepo/mei_for_verovio.xml'\n"
                + "   document.set('xmlns', _MEINS_URL)\n"
                + "   for elem in document.iter():\n"
                + "       elem.tag = elem.tag.replace(_MEINS, '')\n"
                + "   send_to_verovio = etree.tostring(document)\n"
                + "   send_to_verovio = send_to_verovio.replace('\"', '\\\\\"')\n"
                + "   kummand = 'renderNCoda({\"meiForVerovio\": \"' + send_to_verovio + '\"})'\n"
                + "   js.eval(kummand)\n"
                + "\n"
                + "outbound.WHO_IS_LISTENING.connect(mei_listener)\n"
                + "outbound.CONVERSION_FINISHED.connect(mei_through_verovio)\n"
                + "lychee.signals.ACTION_START.emit(dtype='LilyPond', doc='''" + lilypondCode + "''')";

    pypyjsComms.stdin(code);
};


// Actual Loading Stuff -------------------------------------------------------

/**
// TODO: uncomment this stuff
// initial rendering on load
pypyjs.ready().then(renderNCoda);

// start the PyPy.js REPL
pypyjs.ready().then(pypyjs.repl(function() { return _pyromise; }));

// Set the renderNCoda function so it can be used by anyone. But set it now, so that it's not
// available for others (to mess up) until after the initial rendering.
window["renderNCoda"] = renderNCoda;

**/






























// Temporary StructureView Stuff ----------------------------------------------
// TODO: make sure this is all removed
function registerClickEventOnMeiSectionContextMenu() {
    // register whatever whatever
    var itemOne = document.getElementById('ncoda-section-menu-item-1');
    var itemTwo = document.getElementById('ncoda-section-menu-item-2');
    var itemThree = document.getElementById('ncoda-section-menu-item-3');

    itemOne.addEventListener('click', clickContextMenuMeiSection);
    itemTwo.addEventListener('click', clickContextMenuMeiSection);
    itemThree.addEventListener('click', clickContextMenuMeiSection);
}

function clickContextMenuMeiSection(event) {
    // hide the context menu then show an alert acknowledging the click
    var msg = event.target.label + '?\nWill do!';
    var menu = document.getElementById('ncoda-section-menu');
    menu.style.display = 'none';
    alert(msg);
}

function registerClickEventOnMeiSection() {
    // register showContextMenu() as the event listener for "click" events on the ...
    var section_a = document.getElementById('section-a');
    var section_b = document.getElementById('section-b');
    var section_ap = document.getElementById('section-ap');
    var section_c = document.getElementById('section-c');
    var section_app = document.getElementById('section-app');

    section_a.addEventListener('click', showContextMenuMeiSection);
    section_b.addEventListener('click', showContextMenuMeiSection);
    section_ap.addEventListener('click', showContextMenuMeiSection);
    section_c.addEventListener('click', showContextMenuMeiSection);
    section_app.addEventListener('click', showContextMenuMeiSection);
}

function showContextMenuMeiSection(event) {
    // this displays the context menu under the cursor
    var menu = document.getElementById('ncoda-section-menu');
    menu.style.left = event.clientX + 'px';
    menu.style.top = event.clientY + 'px';
    menu.style.display = 'flex';
};

function registerClickEventOnHeaderBar() {
    // register the "click" event for the "fields" in the Header Bar (author, title, ...)
    var author = document.getElementById('header-author');
    var title = document.getElementById('header-title');
    var date = document.getElementById('header-date');
    var add = document.getElementById('header-add');

    author.addEventListener('click', clickHeaderBar);
    title.addEventListener('click', clickHeaderBar);
    date.addEventListener('click', clickHeaderBar);
    add.addEventListener('click', clickHeaderBar);
};

function clickHeaderBar(event) {
    if ('header-add' === event.target.id) {
        alert('We add a new header field.');
    } else {
        alert('You\'ll be able to edit this field: ' + event.target.id);
    }
};

function registerShowHideSSInstrs() {
    var visButton = document.getElementById('scorestructure-visibility');
    visButton.addEventListener('click', showHideScoreStructureInstruments);
    // NOTE this is a hack to make the listening function work
    document.getElementById('scorestructure-instruments').style.display = 'none';
};
function showHideScoreStructureInstruments() {
    var instrList = document.getElementById('scorestructure-instruments');
    var display = ('none' === instrList.style.display) ? 'block' : 'none';
    instrList.style.display = display;
};

function registerShowHideHeaderBar() {
    var visButton = document.getElementById('headerbar-visibility');
    visButton.addEventListener('click', showHideHeaderBar);
    // NOTE this is a hack to make the listening function work
    document.getElementById('headerbar-list').style.display = 'none';
};
function showHideHeaderBar() {
    var headerbar = document.getElementById('headerbar-list');
    var display = ('none' === headerbar.style.display) ? 'block' : 'none';
    headerbar.style.display = display;
};

function registerShowHideCollaborators() {
    var visButton = document.getElementById('collaborators-visibility');
    visButton.addEventListener('click', showHideCollaborators);
    // NOTE this is a hack to make the listening function work
    document.getElementById('ncoda-collaborators-list').style.display = 'none';
};
function showHideCollaborators() {
    var list = document.getElementById('ncoda-collaborators-list');
    var display = ('none' === list.style.display) ? 'block' : 'none';
    list.style.display = display;
};

function registerExpandedSection() {
    var visButton = document.getElementById('expanded-section-visibility');
    visButton.addEventListener('click', showHideExpandedSection);
    // NOTE this is a hack to make the listening function work
    document.getElementById('ncoda-expanded-section-svg').style.display = 'none';
};
function showHideExpandedSection() {
    var list = document.getElementById('ncoda-expanded-section-svg');
    var display = ('none' === list.style.display) ? 'block' : 'none';
    list.style.display = display;
};
// NOTE: end of Temporary StructureView Stuff ---------------------------------




React.render(
    React.createElement(StructureView),
    document.getElementById('ncoda'),
    function() {
        // This function runs when React has finished rendering.
        registerClickEventOnMeiSection();
        registerClickEventOnMeiSectionContextMenu();
        registerClickEventOnHeaderBar();
        registerShowHideSSInstrs();
        registerShowHideHeaderBar();
        registerShowHideCollaborators();
        registerExpandedSection();
    }
);
