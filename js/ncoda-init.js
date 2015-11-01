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


React.render(
    React.createElement(StructureView),
    document.getElementById('ncoda')
);
