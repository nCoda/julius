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

// NOTE: List of public methods
//
// If your text editor's symbol list is as ineffective as mine, you may not catch all of these...
// - Fujian.constructor()
// - Fujian.startWS()
// - Fujian.stopWS()
// - Fujian.statusWS()
// - Fujian.sendWS()
// - Fujian.sendAjax()


import {log} from './log';
import {signals} from '../nuclear/signals';


const FUJIAN_URL = 'ws://localhost:1987/websocket/';
// const fujian ... created and exported after class definition

const FUJIAN_SIGNALS = {
    // Functions that handle signals sent by Lychee. Essentially this maps a Lychee signal name to
    // a NuclearJS signal in Julius. Each function is called with the JSON "response" object sent
    // by Fujian.
    //

    'outbound.CONVERSION_ERROR': function(response) {
        // NB: we are indeed using stdout() for stderr data, until stderr appears somewhere in the UI
        signals.emitters.stdout(`${response.signal}:\n${response.msg}\n`);
    },

    'outbound.CONVERSION_FINISHED': function(response) {
        if ('verovio' === response.dtype) {
            signals.emitters.renderToVerovio(response.document);
        }
    },
};


/** Class representing a connection to a Fujian server running on localhost.
 *
 * Although it appears to be possible to run several concurrent WebSockets connections to the same
 * Fujian server, this is not the intended behaviour. We recommend always using the Fujian instance
 * held in the module-level "fujian" variable.
 */
class Fujian {

    /** Create a Fujian instance. A WebSocket connection is *not* automatically opened.. */
    constructor() {
        this._ws = null;  // holds the WebSocket connection
    }

    /** Open a connection to the Fujian PyPy server. */
    startWS() {
        if ('closed' === this.statusWS()) {
            // make a new connection if there isn't one, or the existing one is closed
            this._fujian = new WebSocket(FUJIAN_URL);
            this._fujian.onmessage = Fujian._receiveWS;
        }
        else {
            log.info('WebSocket connection to Fujian was already open.');
        }
    }

    /** Close an existing connection to the Fujian PyPy server. */
    stopWS() {
        let status = this.statusWS();
        if ('open' === status || 'connecting' == status) {
            this._fujian.close(1000);
            this._fujian = null;
        }
        else {
            log.info('WebSocket connection to Fujian was not running.');
        }
    }

    /** Check the status of the WebSocket connection.
     *
     * @returns {string} Either "connecting", "open", or "closed" depending on the availability of
     *    the WebSocket connection.
     */
    statusWS() {
        if (this._fujian && 1 === this._fujian.readyState) {
            return 'open';
        }
        else {
            return 'closed';
        }
    }

    /** Send some Python code to Fujian with an AJAX request.
     *
     * @param {string} code - The Python code to send to Fujian.
     *
     * We prefer AJAX requests for code written by the user. While user code may cause several Lychee
     * signals to be emitted, there are determined start and end times for execution of user code,
     * much as AJAX requests have known end points.
     *
     * NOTE: Stdout and stderr are printed by default when received as part of an AJAX request. For
     *    nCoda- or Julius-specific backend code, use the WebSocket connection, which only prints
     *    stdout and stderr when there is an uncaught exception.
     */
    sendAjax(code) {
        let request = new XMLHttpRequest();
        request.addEventListener('error', Fujian._errorAjax);
        request.addEventListener('abort', Fujian._abortAjax);
        request.addEventListener('load', Fujian._loadAjax);
        request.open('POST', 'http://localhost:1987');
        request.send(code);

        signals.emitters.stdin(code);
    }

    /** Send some Python code to Fujian over the WebSocket connection.
     *
     * @param {string} code - The Python code to send to Fujian.
     *
     * We prefer the WebSocket for Julius/nCoda-related data, such as emitting a signal, since the
     * WebSocket connection offers less overhead and a closer analogy to an all-client-side app.
     *
     * NOTE: Stdout and stderr are not printed when received over the WebSocket connection unless
     *    there was an uncaught exception. For user-provided code use the AJAX connection.
     */
    sendWS(code) {
        if ('open' === this.statusWS()) {
            try {
                this._fujian.send(code);
            }
            catch (err) {
                if ('SyntaxError' === err.name) {
                    log.error('SyntaxError while sending data to Fujian (probably a Unicode problem?)');
                }
                else {
                    throw err;
                }
            }
        }
        else {
            log.error('Fujian WebSocket connection is not ready. Data not sent.');
        }
    }

    /** Response handling function shared by the WebSocket and AJAX connections.
     *
     * @param {string} data - The string sent by Fujian that contains response data.
     * @param {boolean} doStdio - Whether to output stdout and stderr data.
     *
     * When data arrives over either the WebSocket or AJAX connection, call this function to parse
     * and handle the response.
     *
     * NOTE: Stdout and stderr are always outputted when there was an uncaught exception, regardless
     *    of the settings of doStdio.
     */
    static _commonReceiver(data, doStdio) {
        let response;
        try {
            response = JSON.parse(data);
        }
        catch (err) {
            if ('SyntaxError' === err.name) {
                log.error(`SyntaxError decoding following message from Fujian:\n\n${data}`);
                return;
            }
            else {
                throw err;
            }
        }

        if (undefined !== response.traceback && response.traceback.length > 0) {
            doStdio = true;
            signals.emitters.stdout(response.traceback);
        }

        if (undefined !== response.signal) {
            if (undefined !== FUJIAN_SIGNALS[response.signal]) {
                FUJIAN_SIGNALS[response.signal](response);
            }
        }

        if (doStdio) {
            if (undefined !== response.stdout && response.stdout.length > 0) {
                signals.emitters.stdout(response.stdout);
            }
            if (undefined !== response.stderr && response.stderr.length > 0) {
                // NB: we are indeed using stdout() for stderr data, until stderr appears somewhere in the UI
                signals.emitters.stdout(response.stderr);
            }
            if (undefined !== response.return && response.return.length > 0) {
                log.info(`PyPy (Fujian) additionally returned the following:\n${response.return}`);
            }
        }
    }

    /** Called when a message arrives from Fujian over the WebSocket connection.
     *
     * @param {MessageEvent} event - Containing the data arriving from Fujian.
     *
     * This function calls Fujian._commonReceiver().
     */
    static _receiveWS(event) {
        Fujian._commonReceiver(event.data, false);
    }

    /** Callback for an error in the WebSocket connection. */
    static _errorWS(event) {
        log.error('The WebSocket connection to Fujian encountered an error.');
        log.error(event);
    }

    /** Callback for an aborted AJAX request. */
    static _abortAjax(event) {
        log.error('The AJAX request to Fujian was aborted.');
        log.error(event);
    }

    /** Callback for an erroring AJAX request. */
    static _errorAjax(event) {
        log.error('The AJAX request to Fujian encountered an error.');
        log.error(event);
    }

    /** Called when Fujian completes an AJAX request.
     *
     * @param {MessageEvent} event - Containing the data arriving from Fujian.
     *
     * This function calls Fujian._commonReceiver().
     */
    static _loadAjax(event) {
        Fujian._commonReceiver(event.target.response, true);
    }
}


const fujian = new Fujian();
export {fujian, Fujian};
