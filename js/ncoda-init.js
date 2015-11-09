// ncoda-init.js
// This initializes nCoda.
// Copyright 2015 Christopher Antila


// third-party libraries
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, IndexRoute, Route} from 'react-router';

// Julius React components
import NCoda from './julius/ncoda.src';
import {MainScreen} from './julius/ncoda.src';
import StructureView from './julius/structure_view.src';
import CodeScoreView from './julius/code_score_view.src';

// NuclearJS things
import reactor from './julius/reactor.src';
import headerMetadataStores from './julius/stores/headerMetadata.src';
import mercurial from './julius/stores/mercurial.src';
import documentModule from './julius/stores/document.src';
import stdio from './julius/stores/stdio.src';
import verovio from './julius/stores/verovio.src';

// TODO: remove these, they're just temporary
import signals from './julius/signals.src';



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
        signals.emitters.stdin(suite);
    },
    stdout: function(message) {
        signals.emitters.stdout(message);
    },
    stderr: function(message) {
        // PyPy.js doesn't buffer its stderr, so we'll do it.
        _stderr_buffer.push(message);
        if (message === "\n" || _stderr_buffer.length >= 128) {
            signals.emitters.stdout(_stderr_buffer.join(''));
            _stderr_buffer = [];
        }
    }
};


// hook up the "pypyjsComms" functions
window['submitToPyPy'] = pypyjsComms.stdin;
pypyjs.stdout = pypyjsComms.stdout;
pypyjs.stderr = pypyjsComms.stderr;


// Lychee Stuff ---------------------------------------------------------------

window['renderToVerovio'] = signals.emitters.renderToVerovio;  // NOTE: this is used in the call to Lychee
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
                + "   kummand = 'renderToVerovio(\"' + send_to_verovio + '\")'\n"
                + "   js.eval(kummand)\n"
                + "\n"
                + "outbound.WHO_IS_LISTENING.connect(mei_listener)\n"
                + "outbound.CONVERSION_FINISHED.connect(mei_through_verovio)\n"
                + "lychee.signals.ACTION_START.emit(dtype='LilyPond', doc='''" + lilypondCode + "''')";

    pypyjsComms.stdin(code);
};
window['submitToLychee'] = submitToLychee;


// Actual Loading Stuff -------------------------------------------------------

// start the PyPy.js REPL
pypyjs.ready().then(pypyjs.repl(function() { return _pyromise; }));

// register our NuclearJS stores
reactor.registerStores({
    'headerMetadata': headerMetadataStores.MetadataHeaders,
    'hgChangesetHistory': mercurial.ChangesetHistory,
    'instruments': documentModule.scoreDef.Instruments,
    'stdin': stdio.Stdin,
    'stdout': stdio.Stdout,
    'stderr': stdio.Stderr,  // NOTE: don't use stderr (for now?) because it isn't shown in CodeScoreView
    'meiForVerovio': verovio.MeiForVerovio,
});

// TODO: this is temporary... it's just setting up the default data
signals.emitters.addHeader('Author', 'Kitty Cat');
signals.emitters.addHeader('Title', 'Meowmeow');
signals.emitters.addHeader('Date', '42nd of Telephone');
signals.emitters.hgAddChangeset({name: 'Christopher Antila', date: '2015-10-06', summary: 'swapped outer voices'});
signals.emitters.hgAddChangeset({name: 'Christopher Antila', date: '2015-09-14', summary: 'corrected whatever blah'});
signals.emitters.hgAddChangeset({name: 'Christopher Antila', date: '2014-12-22', summary: 'who let the dogs out?'});
signals.emitters.hgAddChangeset({name: 'Honoré de Balzac', date: '2015-10-09', summary: 'added some notes'});
signals.emitters.hgAddChangeset({name: 'Honoré de Balzac', date: '2015-10-08', summary: 'put in some stuff'});
signals.emitters.hgAddChangeset({name: 'Honoré de Balzac', date: '2015-05-05', summary: 'clean up WenXuan\'s noodles'});
signals.emitters.hgAddChangeset({name: '卓文萱', date: '2015-05-07', summary: '小心點'});
signals.emitters.hgAddChangeset({name: '卓文萱', date: '2015-05-04', summary: '我买了面条'});
signals.emitters.hgAddChangeset({name: '卓文萱', date: '2014-12-20', summary: '狗唱歌'});
signals.emitters.addInstrumentGroup([{label: 'Flauto piccolo'},
    {label: 'Flauto I'},
    {label: 'Flauto II'}]);
signals.emitters.addInstrumentGroup([{label: 'Oboe I'},
    {label: 'Oboe II'},
    {label: 'Corno ingelese'}]);
signals.emitters.addInstrumentGroup([{label: 'Clarinetto in B I'},
    {label: 'Clarinetto in B II'},
    {label: 'Clarinetto basso in B'}]);
signals.emitters.addInstrumentGroup([{label: 'Fagotto I'},
    {label: 'Fagotto II'},
    {label: 'Contrafagotto'}]);
signals.emitters.addInstrumentGroup([{label: 'Corno in F I'},
    {label: 'Corno in F II'},
    {label: 'Corno in F III'},
    {label: 'Corno in F IV'}]);
signals.emitters.addInstrumentGroup([{label: 'Tromba in B I'},
    {label: 'Tromba in B II'},
    {label: 'Tromba in B III'}]);
signals.emitters.addInstrumentGroup([{label: 'Trombone I'},
    {label: 'Trombone II'},
    {label: 'Trombone III'}]);
signals.emitters.addInstrumentGroup([{label: 'Timpani I'},
    {label: 'Timpani II'}]);
signals.emitters.addInstrument({label: 'Stahlstäbe'});
signals.emitters.addInstrument({label: 'Triangolo'});
signals.emitters.addInstrument({label: '2 Arpe'});
signals.emitters.addInstrumentGroup([{label: 'Violino I'},
    {label: 'Violino II'}]);
signals.emitters.addInstrument({label: 'Viola'});
signals.emitters.addInstrument({label: 'Violoncello'});
signals.emitters.addInstrument({label: 'Contrabasso'});


ReactDOM.render((
    <Router>
        <Route path="/" component={NCoda}>
            <IndexRoute component={MainScreen}/>
            <Route path="codescore" component={CodeScoreView}/>
            <Route path="structure" component={StructureView}/>
        </Route>
    </Router>
), document.getElementById('julius-goes-here'));
