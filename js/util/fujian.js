// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/util/fujian.js
// Purpose:                Code for connecting between Julius and Fujian.
//
// Copyright (C) 2016, 2017 Christopher Antila
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
// ------------------------------------------------------------------------------------------------

// NOTE: List of public methods
//
// If your text editor's symbol list is as ineffective as mine, you may not catch all of these...
// - Fujian.constructor()
// - Fujian.startWS()
// - Fujian.stopWS()
// - Fujian.statusWS()
// - Fujian.sendWS()
// - Fujian.sendAjax()

import Immutable from 'immutable';

import {log} from './log';
import {signals} from '../nuclear/signals';

import { store } from '../stores';
import { actions as docActions } from '../stores/document';
import { actions as metaActions, getters as metaGetters } from '../stores/meta';
import { actions as uiActions } from '../stores/ui';


const FUJIAN_WS_URL = 'ws://localhost:1987/websocket/';
const FUJIAN_AJAX_URL = 'http://localhost:1987';
const WS_CLOSE_CODE = 1000;
// const fujian ... created and exported after class definition

const ERROR_MESSAGES = {
    // These error messages are in a module-level constant for two reasons: (1) to ease testing
    // when we know the expected error message; and (2) to ease translation of the messages
    websocketError: 'The WebSocket connection to Fujian encountered an error.',
    ajaxAbort: 'The AJAX request to Fujian was aborted.',
    ajaxError: 'The AJAX request to Fujian encountered an error.',
    fjnBadJson: 'SyntaxError while decoding a message from Fujian',
    fjnRetVal: 'PyPy additionally returned the following:',
    wsAlreadyOpen: 'WebSocket connection to Fujian was already open.',
    wsNotReady: 'Fujian WebSocket connection is not ready. Data not sent.',
    wsSyntaxError: 'SyntaxError while sending data to Fujian (probably a Unicode problem?)',
    outboundConv: 'Error during outbound conversion',
};

const FUJIAN_SIGNALS = {
    // Functions that handle signals sent by Lychee. Essentially this maps a Lychee signal name to
    // a NuclearJS signal in Julius. Each function is called with the JSON "response" object sent
    // by Fujian.
    //

    // TODO: add tests
    'outbound.CONVERSION_ERROR': (response) => {
        // NB: we are indeed using stdout() for stderr data, until stderr appears somewhere in the UI
        let message;
        if (response.msg) {
            message = `${ERROR_MESSAGES.outboundConv}: ${response.msg}`;
        }
        else {
            message = ERROR_MESSAGES.outboundConv;
        }
        metaActions.writeToStdio('stdout', message);
        log.error(message);
    },

    // TODO: add tests
    'outbound.CONVERSION_FINISHED': (response) => {
        // everything else
        switch (response.dtype) {
            case 'lilypond':
            case 'verovio':
                docActions.updateSectionData(response.dtype, response.placement, response.document);
                break;

            case 'document':
                let document;
                try {
                    document = JSON.parse(response.document);
                }
                catch (err) {
                    if ('SyntaxError' === err.name) {
                        log.error(ERROR_MESSAGES.fjnBadJson);
                        return;
                    }
                    throw err;
                }
                docActions.updateSections(document);
                break;

            default:
                return;
        }
    },

    // TODO: add tests
    'LOG_MESSAGE': (response) => {
        if (response.status === 'failure') {
            if (response.message === 'Lychee-MEI file has different version than us') {
                log.info(response.message);
            }
            else if (response.level === 'CRITICAL') {
                log.error(response.message);
            }
            else {
                log.warn(response.message);
            }
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

    /** Create a Fujian instance. A WebSocket connection is *not* automatically opened.
     *
     * @constructor
     */
    constructor() {
        this._ws = null;  // holds the WebSocket connection
    }

    /** Open a connection to the Fujian PyPy server.
     *
     * @returns {undefined}
     */
    startWS() {
        if ('closed' === this.statusWS()) {
            // prepare the message queue
            this._sendWhenReady = Immutable.List();
            // make a new connection if there isn't one, or the existing one is closed
            this._fujian = new WebSocket(FUJIAN_WS_URL);
            this._fujian.onmessage = Fujian._receiveWS;
            this._fujian.onerror = Fujian._errorWS;
            this._fujian.onopen = this._sendWSWhenReady;
            // Put a reference to this Fujian instance on our WebSocket object so it's accessible
            // from the "onopen" event handler.
            this._fujian._fujian = this;
        }
        else {
            log.info(ERROR_MESSAGES.wsAlreadyOpen);
        }
    }

    /** Close an existing connection to the Fujian PyPy server.
     *
     * @returns {undefined}
     */
    stopWS() {
        const status = this.statusWS();
        if ('open' === status || 'connecting' === status) {
            this._fujian.close(WS_CLOSE_CODE);
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
        let status = 'closed';
        if (this._fujian) {
            if (0 === this._fujian.readyState) {
                status = 'connecting';
            }
            else if (1 === this._fujian.readyState) {
                status = 'open';
            }
        }
        return status;
    }

    /** Send some Python code to Fujian with an AJAX request.
     *
     * @param {string} code - The Python code to send to Fujian.
     * @returns {undefined}
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
        const request = new XMLHttpRequest();
        request.addEventListener('error', Fujian._errorAjax);
        request.addEventListener('abort', Fujian._abortAjax);
        request.addEventListener('load', Fujian._loadAjax);
        request.open('POST', FUJIAN_AJAX_URL);
        request.send(code);

        metaActions.writeToStdio('stdin', code);
    }

    /** A callback for the "onopen" WebSocket event that sends queued messages.
     *
     * This function should be called after the WebSocket connection is ready. It takes the contents
     * of the "this._sendWhenReady" List
     */
    _sendWSWhenReady() {
        // We have to make a copy of _sendWhenReady and set that to null *first* or else sendWS()
        // will simply re-queue the message.
        const messages = this._fujian._sendWhenReady;
        this._fujian._sendWhenReady = null;
        messages.forEach((message) => this._fujian.sendWS.call(this._fujian, message));
    }

    /** Send some Python code to Fujian over the WebSocket connection.
     *
     * @param {string} code - The Python code to send to Fujian.
     * @returns {undefined}
     *
     * We prefer the WebSocket for Julius/nCoda-related data, such as emitting a signal, since the
     * WebSocket connection offers less overhead and a closer analogy to an all-client-side app.
     *
     * NOTE: If the WebSocket connection is not ready, data is queued to be sent when the connection
     *    becomes ready.
     *
     * NOTE: Stdout and stderr are not printed when received over the WebSocket connection unless
     *    there was an uncaught exception. For user-provided code use the AJAX connection.
     */
    sendWS(code) {
        if (null !== this._sendWhenReady) {
            // We try to prevent data loss and preserve the order of messages by checking whether
            // the queue has already been sent. If we simply checked the connection status, there
            // is a possibility that sendWS() will be called after the connection is ready but
            // before the "onopen" event handler was called, which would result in sending messages
            // out of order.
            //
            // Because _sendWSWhenReady() sets _sendWhenReady to null, we can determine whether that
            // function has already been run.
            this._sendWhenReady = this._sendWhenReady.push(code);
        }
        else if ('open' === this.statusWS()) {
            try {
                this._fujian.send(code);
            }
            catch (err) {
                if ('SyntaxError' === err.name) {
                    log.error(ERROR_MESSAGES.wsSyntaxError);
                }
                else {
                    throw err;
                }
            }
        }
        else {
            log.error(ERROR_MESSAGES.wsNotReady);
        }
    }

    /** Response handling function shared by the WebSocket and AJAX connections.
     *
     * @param {string} data - The string sent by Fujian that contains response data.
     * @param {boolean} doStdio - Whether to output stdout and stderr data.
     * @returns {undefined}
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
                log.error(ERROR_MESSAGES.fjnBadJson);
                return;
            }
            throw err;
        }

        if ('string' === typeof response.traceback && response.traceback.length > 0) {
            doStdio = true;  /* eslint no-param-reassign: 0 */
            // NB: we are indeed using stdout() for stderr data, until stderr appears somewhere in the UI
            metaActions.writeToStdio('stdout', response.traceback);
            uiActions.showModal(
                'error',
                'Unhandled Exception in Python',
                ('There was an unhandled exception in the Python interpreter. This means ' +
                 'there was an error but we could not fix it automatically. There is a ' +
                 'traceback (error report) in the nCoda Python Console.'
                ),
            );
        }

        if (response.signal) {
            if (FUJIAN_SIGNALS[response.signal]) {
                FUJIAN_SIGNALS[response.signal](response);
            }
        }

        if (doStdio || metaGetters.logLevel(store.getState()) === log.LEVELS.DEBUG) {
            if ('string' === typeof response.stdout && response.stdout.length > 0) {
                metaActions.writeToStdio('stdout', response.stdout);
            }
            if ('string' === typeof response.stderr && response.stderr.length > 0) {
                // NB: we are indeed using stdout() for stderr data, until stderr appears somewhere in the UI
                metaActions.writeToStdio('stdout', response.stderr);
            }
            if ('string' === typeof response.return && response.return.length > 0) {
                log.info(ERROR_MESSAGES.fjnRetVal);
                log.info(response.return);
            }
        }
    }

    /** Called when a message arrives from Fujian over the WebSocket connection.
     *
     * @param {MessageEvent} event - Containing the data arriving from Fujian.
     * @returns {undefined}
     *
     * This function calls Fujian._commonReceiver().
     */
    static _receiveWS(event) {
        Fujian._commonReceiver(event.data, false);
    }

    /** Callback for an error in the WebSocket connection.
     *
     * @param {Event} event - The error event.
     * @returns {undefined}
     */
    static _errorWS(event) {
        log.error(ERROR_MESSAGES.websocketError);
        log.error(event);
    }

    /** Callback for an aborted AJAX request.
     *
     * @param {ProgressEvent} event - The abort event.
     * @returns {undefined}
     */
    static _abortAjax(event) {
        log.error(ERROR_MESSAGES.ajaxAbort);
        log.error(event);
    }

    /** Callback for an erroring AJAX request.
     *
     * @param {ProgressEvent} event - The error event.
     * @returns {undefined}
     */
    static _errorAjax(event) {
        log.error(ERROR_MESSAGES.ajaxError);
        log.error(event);
    }

    /** Called when Fujian completes an AJAX request.
     *
     * @param {MessageEvent} event - Containing the data arriving from Fujian.
     * @returns {undefined}
     *
     * This function calls Fujian._commonReceiver().
     */
    static _loadAjax(event) {
        Fujian._commonReceiver(event.target.response, true);
    }
}


const fujian = new Fujian();
export {fujian, Fujian, ERROR_MESSAGES, FUJIAN_WS_URL, FUJIAN_AJAX_URL};
