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


/* eslint-disable no-underscore-dangle */

import Immutable from 'immutable';

import { log } from './log';
import store from '../stores';
import { types as docTypes } from '../stores/document';
// TODO: figure out why I can't import this properly
// import { types as fjnTypes } from '../stores/fujian';
import { types as lilyTypes } from '../stores/lilypond';
import { actions as metaActions, getters as metaGetters, types as metaTypes } from '../stores/meta';
import { actions as uiActions } from '../stores/ui';


export const FUJIAN_WS_URL = 'ws://localhost:1987/websocket/';
export const FUJIAN_AJAX_URL = 'http://localhost:1987';
export const WS_CLOSE_CODE = 1000;
export const WS_RESTART_DELAY = 500;  // half a second

export const WS_STATUS = {
    CONNECTING: 'Connecting to Fujian via WebSocket.',
    OPEN: 'WebSocket connection to Fujian is open.',
    CLOSED: 'WebSocket connection fo Fujian is closed.',
};

export const ERROR_MESSAGES = {
    // These error messages are in a module-level constant for two reasons: (1) to ease testing
    // when we know the expected error message; and (2) to ease translation of the messages
    websocketError: 'The WebSocket connection to Fujian encountered an error.',
    ajaxAbort: 'The AJAX request to Fujian was aborted.',
    ajaxError: 'The AJAX request to Fujian encountered an error.',
    fjnBadJson: 'SyntaxError while decoding a message from Fujian',
    fjnRetVal: 'Python additionally returned the following:',
    wsAlreadyOpen: 'WebSocket connection to Fujian was already open.',
    wsNotReady: 'Fujian WebSocket connection is not ready. Data not sent.',
    wsSyntaxError: 'SyntaxError while sending data to Fujian (probably a Unicode problem?)',
};

export const FUJIAN_ACTIONS = {
    // When Fujian admits an FSA (Flux Standard Action) they are mapped from the action name to
    // the actual JavaScript constant with this object.

    'document.types.UPDATE_SECTION_DATA': docTypes.UPDATE_SECTION_DATA,
    'document.types.WILL_UPDATE_SECTIONS': docTypes.WILL_UPDATE_SECTIONS,
    'document.types.UPDATED_SECTIONS': docTypes.UPDATED_SECTIONS,
    'fujian.SAVE_COMPLETED': 'fujian.SAVE_COMPLETED',  // TODO: use the constant from "Fujian" store
    'lilypond.types.UPDATE_PDF': lilyTypes.UPDATE_PDF,
    'meta.types.WRITE_STDERR': metaTypes.WRITE_STDOUT,  // until stderr shows in UI
    'meta.types.WRITE_STDOUT': metaTypes.WRITE_STDOUT,
};


/** Class representing a connection to a Fujian server running on localhost.
 *
 * Although it appears to be possible to run several concurrent WebSockets connections to the same
 * Fujian server, this is not the intended behaviour. We recommend always using the Fujian instance
 * held in the module-level "fujian" variable.
 */
export class Fujian {

    /** Create a Fujian instance. A WebSocket connection is *not* automatically opened.
     *
     * @constructor
     */
    constructor() {
        this._fujian = null;  // holds the WebSocket connection
        this._sendWhenReady = Immutable.List();

        this.startWS = this.startWS.bind(this);
        this.stopWS = this.stopWS.bind(this);
        this.statusWS = this.statusWS.bind(this);
        this.sendAjax = this.sendAjax.bind(this);
        this.sendWS = this.sendWS.bind(this);
        this._errorWS = this._errorWS.bind(this);
        this._sendWSWhenReady = this._sendWSWhenReady.bind(this);
    }

    /** Open a connection to Fujian. */
    startWS() {
        if (this.statusWS() === WS_STATUS.CLOSED) {
            this._fujian = new WebSocket(FUJIAN_WS_URL);
            this._fujian.onmessage = Fujian._receiveWS;
            this._fujian.onerror = this._errorWS;
            this._fujian.onopen = this._sendWSWhenReady;
        } else {
            log.info(ERROR_MESSAGES.wsAlreadyOpen);
        }
    }

    /** Close an existing connection to Fujian. */
    stopWS() {
        const status = this.statusWS();
        if (status === WS_STATUS.OPEN || status === WS_STATUS.CONNECTING) {
            this._fujian.close(WS_CLOSE_CODE);
            this._fujian = null;
        } else {
            log.info('WebSocket connection to Fujian was not running.');
        }
    }

    /** Check the status of the WebSocket connection.
     *
     * @returns {string} - One of the WS_STATUS constants.
     */
    statusWS() {
        if (this._fujian && this._fujian.readyState === 0) {
            return WS_STATUS.CONNECTING;
        } else if (this._fujian && this._fujian.readyState === 1) {
            return WS_STATUS.OPEN;
        }
        return WS_STATUS.CLOSED;
    }

    /** Send some Python code to Fujian with an AJAX request.
     *
     * @param {string} code - The Python code to send to Fujian.
     *
     * We prefer AJAX requests for code written by the user. While user code may cause several
     * Lychee signals to be emitted, there are determined start and end times for execution of
     * user code, much as AJAX requests have known end points.
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
    }

    /** Send queued messages for Fujian.
     *
     * This is a callback for the "onopen" WebSocket event, called when the WebSocket connection
     * is ready. It send the contents of the "this._sendWhenReady" List one at a time.
     */
    _sendWSWhenReady() {
        // We have to make a copy of _sendWhenReady and set that to null *first* or else sendWS()
        // will simply re-queue the message.
        const messages = this._sendWhenReady;
        this._sendWhenReady = null;
        messages.forEach(message => this.sendWS(message));
    }

    /** Send a message to Fujian over the WebSocket connection.
     *
     * @param {string} code - The message to send to Fujian.
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
        if (this._sendWhenReady !== null) {
            // We try to prevent data loss and preserve the order of messages by checking whether
            // the queue has already been sent. If we simply checked the connection status, there
            // is a possibility that sendWS() will be called after the connection is ready but
            // before the "onopen" event handler was called, which would result in sending messages
            // out of order.
            //
            // Because _sendWSWhenReady() sets _sendWhenReady to null, we can determine whether that
            // function has already been run.
            this._sendWhenReady = this._sendWhenReady.push(code);
        } else if (this.statusWS() === WS_STATUS.OPEN) {
            try {
                this._fujian.send(code);
            } catch (err) {
                if (err.name === 'SyntaxError') {
                    log.error(ERROR_MESSAGES.wsSyntaxError);
                } else {
                    throw err;
                }
            }
        } else {
            log.error(ERROR_MESSAGES.wsNotReady);
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
        } catch (err) {
            if (err.name === 'SyntaxError') {
                log.error(ERROR_MESSAGES.fjnBadJson);
                return;
            }
            throw err;
        }

        if (typeof response.traceback === 'string' && response.traceback.length > 0) {
            doStdio = true;  /* eslint no-param-reassign: 0 */
            // NB: we are indeed using stdout() for stderr data, until stderr
            // appears somewhere in the UI
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

        if (response.is_fsa === true) {
            // ideally Fujian gives us an FSA
            delete response.is_fsa;
            response.type = FUJIAN_ACTIONS[response.type];
            store.dispatch(response);
        }

        if (doStdio || metaGetters.logLevel(store.getState()) === log.LEVELS.DEBUG) {
            if (typeof response.stdout === 'string' && response.stdout.length > 0) {
                metaActions.writeToStdio('stdout', response.stdout);
            }
            if (typeof response.stderr === 'string' && response.stderr.length > 0) {
                // NB: we are indeed using stdout() for stderr data, until stderr appears somewhere in the UI
                metaActions.writeToStdio('stdout', response.stderr);
            }
            if (typeof response.return === 'string' && response.return.length > 0) {
                log.info(ERROR_MESSAGES.fjnRetVal);
                log.info(response.return);
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

    /** Callback for an error in the WebSocket connection.
     *
     * This method sets up the Fujian instance to reinitialize the WebSocket connection.
     * Messages already queued for Fujian in _sendWhenReady are retained. If _sendWhenReady
     * is null, a new Immutable.List is created there.
     *
     * If the WebSocket connection had been successfully initialized, this method
     */
    _errorWS() {
        this._fujian = null;
        if (!Immutable.List.isList(this._sendWhenReady)) {
            log.error(ERROR_MESSAGES.websocketError);
            this._sendWhenReady = Immutable.List();
        }
        if (window && typeof window.setTimeout === 'function') {
            window.setTimeout(this.startWS, WS_RESTART_DELAY);
        }
    }

    /** Callback for an aborted AJAX request.
     *
     * @param {ProgressEvent} event - The abort event.
     */
    static _abortAjax(event) {
        log.error(ERROR_MESSAGES.ajaxAbort);
        log.error(event);
    }

    /** Callback for an erroring AJAX request.
     *
     * @param {ProgressEvent} event - The error event.
     */
    static _errorAjax(event) {
        log.error(ERROR_MESSAGES.ajaxError);
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


export default Fujian;
