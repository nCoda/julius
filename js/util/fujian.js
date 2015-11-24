// -*- coding: utf-8 -*-
//-------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/util/fujian.js
// Purpose:                Code for connecting between Julius and Fujian.
//
// Copyright (C) 2015 Christopher Antila
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//-------------------------------------------------------------------------------------------------


import {log} from './log';
import {signals} from '../nuclear/signals';


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
    if (response.traceback && response.traceback.length > 0) {
        signals.emitters.stdout(response.traceback);
    }
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
    if (response.signal) {
        // handle signals
        switch (response.signal) {
            case 'outbound.CONVERSION_ERROR':
                signals.emitters.stdout(`${response.signal}:\n${response.msg}\n`);
                break;

            case 'outbound.CONVERSION_FINISHED':
                if ('mei' === response.dtype) {
                    // TODO: this weird bit simply removes the namespaces from the tags...
                    //       maybe, hopefully, there will be a better way to do that?
                    let doc = response.document
                    while (doc.includes('mei:')) {
                        doc = doc.replace('mei:', '');
                    }
                    doc = `<?xml version="1.0" encoding="UTF-8"?>\n${doc}`;
                    signals.emitters.renderToVerovio(doc);
                }
                break;
        }
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


// PyPy (Fujian) AJAX ---------------------------------------------------------

function pypyRequestFailed(event) {
    //

    log.error('The request to PyPy (Fujian) failed.');
    log.error(event);
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
            signals.emitters.stdout(`!! PyPy additionally returned the following:\n${response.return}`);
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


export {fujianStart, fujianStop, submitToFujianWs, submitToFujianAjax};
