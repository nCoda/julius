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


// PyPy (Fujian) WebSocket ----------------------------------------------------

const FUJIAN_URL = 'ws://localhost:1987/websocket/';
let fujian = null;

function fujianStart() {
    // Open a connection to the Fujian PyPy server. Called on application start below.

    if (null === fujian) {
        fujian = new WebSocket(FUJIAN_URL);
        fujian.onmessage = receiveFujian;
    } else {
        console.error(`fujianStart(): Fujian was already connected (status ${fujian.readyState})`);
    }
};

function fujianStop() {
    // Close an existing connection to the Fujian PyPy server.

    if (null !== fujian) {
        if (fujian.readyState < 2) {
            fujian.close(1000);
        }
        fujian = null;
    } else {
        console.error('fujianStop(): Fujian was not running');
    }
};

function receiveFujian(event) {
    // Called to handle a message from Fujian received over the WebSocket connection.

    console.log(event);

    let response = JSON.parse(event.data);
    if (undefined !== response.stdout && response.stdout.length > 0) {
        signals.emitters.stdout(response.stdout);
    }
    if (undefined !== response.stderr && response.stderr.length > 0) {
        // NB: we are indeed using stdout() for stderr data, until stderr appears somewhere in the UI
        signals.emitters.stdout(response.stderr);
    }
    if (undefined !== response.return && response.return.length > 0) {
        console.log(`PyPy (Fujian) additionally returned the following:\n${response.return}`);
    }
};

function submitToFujianWs(code) {
    // Send some Python code to Fujian over the WebSocket connection.

    if (null !== fujian && 1 === fujian.readyState) {
        fujian.send(code);
    } else {
        console.error(`Fujian WebSocket connection is in state ${fujian.readyState}\nData not sent.`);
    }
};

fujianStart();


// PyPy (Fujian) AJAX ---------------------------------------------------------

function pypyRequestFailed(event) {
    //

    console.error('The request to PyPy (Fujian) failed.');
    console.error(event);
};

function pypyRequestError(event) {
    // When the request fails on the server, display the traceback.
    // This function can work for all sorts of requests.
    //

    let response = JSON.parse(event.target.response);
    signals.emitters.stdout(response.traceback);
};

function pypyRequestSuccessed(event) {
    //

    if (200 !== event.target.status) {
        return pypyRequestError(event);
    } else {
        let response = JSON.parse(event.target.response);
        signals.emitters.stdout(response.stdout);
        if (response.return.length > 0) {
            console.log(`PyPy (Fujian) additionally returned the following:\n${response.return}`);
        }
    }
};

function submitToFujianAjax(code) {
    //

    let request = new XMLHttpRequest();
    request.addEventListener('error', pypyRequestFailed);
    request.addEventListener('load', pypyRequestSuccessed);
    request.open('POST', 'http://localhost:1987');
    request.send(code);

    signals.emitters.stdin(code);
};

window['submitToPyPy'] = submitToFujianWs;


// Lychee Stuff ---------------------------------------------------------------

function requestSuccessedLychee(event) {
    if (200 !== event.target.status) {
        return pypyRequestError(event);
    } else {
        let response = JSON.parse(event.target.response);
        signals.emitters.stdout(response.stdout);
        signals.emitters.renderToVerovio(`<?xml version="1.0" encoding="UTF-8"?>\n${response.return}`);
    }
};

window['renderToVerovio'] = signals.emitters.renderToVerovio;  // NOTE: this is used in the call to Lychee
var submitToLychee = function(lilypondCode) {
    // TODO: this should probably be moved somewhere to the "signals" module
    // TODO: or consolidate it into submitToPyPy() ... and still into the signals
    // When given some LilyPond code, this function submits it to PyPy.js as a call to Lychee.
    //
    // @param lilypondCode (str): The LilyPond code to submit to Lychee.

    // NOTE: Lychee's Document.__init__() currently creates the "testrepo" directory for us

    let code =    "import lychee\n"
                + "from lychee import signals\n"
                + "from lychee.signals import outbound\n"
                + "from xml.etree import ElementTree as etree\n"
                + "\n"
                + "_MEINS = '{http://www.music-encoding.org/ns/mei}'\n"
                + "_MEINS_URL = 'http://www.music-encoding.org/ns/mei'\n"
                + "\n"
                + "def mei_listener(**kwargs):\n"
                + "    outbound.I_AM_LISTENING.emit(dtype='mei')\n"
                + "\n"
                + "def mei_through_verovio(dtype, placement, document, **kwargs):\n"
                + "   global fujian_return\n"
                + "   if 'mei' != dtype:\n"
                + "       return\n"
                + "   output_filename = 'testrepo/mei_for_verovio.xml'\n"
                + "   document.set('xmlns', _MEINS_URL)\n"
                + "   for elem in document.iter():\n"
                + "       elem.tag = elem.tag.replace(_MEINS, '')\n"
                + "   send_to_verovio = etree.tostring(document)\n"
                + "   fujian_return = send_to_verovio\n"
                + "\n"
                + "outbound.WHO_IS_LISTENING.connect(mei_listener)\n"
                + "outbound.CONVERSION_FINISHED.connect(mei_through_verovio)\n"
                + "lychee.signals.ACTION_START.emit(dtype='LilyPond', doc='''" + lilypondCode + "''')";

    let request = new XMLHttpRequest();
    request.addEventListener('error', pypyRequestFailed);
    request.addEventListener('load', requestSuccessedLychee);
    request.open('POST', 'http://localhost:1987');
    request.send(code);

    signals.emitters.stdin(code);
};
window['submitToLychee'] = submitToLychee;


// Actual Loading Stuff -------------------------------------------------------

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


// TODO: this is a sign that these things don't belong in the "init" file!
export {fujianStart, fujianStop};
