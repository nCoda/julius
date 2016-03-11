// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/nuclear/signals.js
// Purpose:                NuclearJS Actions and ActionTypes.
//
// Copyright (C) 2016 Christopher Antila
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

// Note: This module is called "signals" so that nCoda has a consistent relationship between its
//       Python and JavaScript worlds. In JavaScript, our NuclearJS "actionTypes" are effectively
//       the names of signals, and "actions" are effectively the signals' "emit" functions.
//

import {Immutable} from 'nuclear-js';

import {getters} from './getters';
import {log} from '../util/log';
import reactor from './reactor';
import {fujian} from '../util/fujian';


// "names" is NuclearJS "actionTypes."
const names = {
    // HeaderBar
    HEADERS_FROM_LYCHEE: 'HEADERS_FROM_LYCHEE',
    ADD_HEADER: 'ADD_HEADER',
    CHANGE_HEADER: 'CHANGE_HEADER',
    REMOVE_HEADER: 'REMOVE_HEADER',
    // Mercurial stuff
    VCS_NEW_REVLOG: 'VCS_NEW_REVLOG',
    // MEI Document Stuff
    SECTIONS_FROM_LYCHEE: 'SECTIONS_FROM_LYCHEE',
    MOVE_SECTION_CURSOR: 'MOVE_SECTION_CURSOR',
    // Standard I/O
    STDIN: 'STDIN',
    STDOUT: 'STDOUT',
    STDERR: 'STDERR',
    // Verovio
    INITIALIZE_VIDA: 'INITIALIZE_VIDA',
    LOAD_MEI: 'LOAD_MEI',
    RENDER_TO_VEROVIO: 'RENDER_TO_VEROVIO',
    // Fujian PyPy Server (currently doesn't affect NuclearJS)
    FUJIAN_START_WS: 'FUJIAN_START_WS',
    FUJIAN_RESTAT_WS: 'FUJIAN_RESTAT_WS',
    FUJIAN_CLOSE_WS: 'FUJIAN_CLOSE_WS',
    // Logging
    SET_LOG_LEVEL: 'SET_LOG_LEVEL',
    // DialogueBox
    DIALOGUEBOX_SHOW: 'DIALOGUEBOX_SHOW',
    DIALOGUEBOX_HIDE: 'DIALOGUEBOX_HIDE',
};


// "emitters" is NuclearJS "actions."
const emitters = {
    // MEI headers
    /** Replace the current MEI headers with these new ones from Lychee.
     * @param {Object} newHeaders - The "headers" object from Lychee's "document" converter.
     */
    headersFromLychee(newHeaders) {
        reactor.dispatch(names.HEADERS_FROM_LYCHEE, newHeaders);
    },
    addHeader(name, value) {
        // The name and value of the header to add.
        reactor.dispatch(names.ADD_HEADER, {name: name, value: value});
    },
    changeHeader(name, value) {
        // The name of an existing header and its new value.
        reactor.dispatch(names.CHANGE_HEADER, {name: name, value: value});
    },
    removeHeader(name) {
        // The name of an existing header.
        reactor.dispatch(names.REMOVE_HEADER, {name: name});
    },

    // Mercurial stuff
    vcsNewRevlog(revlog) {
        // A new, complete revlog from Mercurial.
        reactor.dispatch(names.VCS_NEW_REVLOG, revlog);
    },

    // MEI Document Stuff
    /** Replace the current <scoreDef> objects with these new ones from Lychee.
     * @param {Object} scoreDef - The "sections" object from Lychee's "document" converter.
     */
    documentFromLychee(scoreDef) {
        reactor.dispatch(names.SECTIONS_FROM_LYCHEE, scoreDef);
    },

    // Standard I/O
    stdin(string) {
        reactor.dispatch(names.STDIN, string);
    },
    stdout(string) {
        reactor.dispatch(names.STDOUT, string);
    },
    stderr(string) {
        reactor.dispatch(names.STDERR, string);
    },

    // Verovio
    initializeVida(settings) {
        reactor.dispatch(names.INITIALIZE_VIDA, settings);
    },

    loadMEI(mei) {
        reactor.dispatch(names.LOAD_MEI, mei)
    },

    renderToVerovio(mei) {
        reactor.dispatch(names.RENDER_TO_VEROVIO, mei);
    },

    // Fujian PyPy Server (currently doesn't affect NuclearJS)
    fujianStartWS() {
        fujian.startWS();
    },
    fujianRestartWS() {
        fujian.stopWS();
        fujian.startWS();
    },
    fujianStopWS() {
        fujian.stopWS();
    },
    submitToLychee(data, format) {
        // Given some "data" and a "format," send the data to Lychee via Fujian as an update to the
        // currently-active score/section.
        //
        // Parameters:
        // - data (string) Data to submit to Lychee.
        // - format (string) The string "lilypond".
        //

        if ('string' !== typeof data) {
            log.error('submitToLychee() received a "data" argument that is not a string.');
            return;
        }

        if ('lilypond' === format) {
            // First check there is no """ in the string, which would cause the string to terminate
            // early and allow executing arbitrary code.
            if (-1 === data.indexOf('"""')) {
                const code = `import lychee\nlychee.signals.ACTION_START.emit(dtype='LilyPond', doc="""${data}""")`;
                fujian.sendWS(code);
            }
            else {
                log.error('Invalid LilyPond code. Please do not use """ in your LilyPond code.');
            }
        }
        else {
            log.error('submitToLychee() received an unknown "format" argument.');
        }
    },
    submitToPyPy(code) {
        // For code being submitted by the human user.
        //
        fujian.sendAjax(code);
    },

    // Logging
    setLogLevel(newLevel) {
        reactor.dispatch(names.SET_LOG_LEVEL, newLevel);
    },

    // Registering outbound formats with Lychee
    _regOutboundFormat(direction, dtype, who, extra) {
        // You must call this through registerOutboundFormat() or unregisterOutboundFormat().
        // --> the "extra" param is just a string where you can put stuff for an extra argument to the signal
        //
        if ('string' !== typeof dtype) {
            const msg = `Calling ${direction}_FORMAT requires a string for "dtype".`;
            log.warn(msg);
            return;
        }

        if (!extra) {
            extra = '';
        }

        dtype = `'${dtype}'`;
        if ('string' === typeof who) {
            who = `'${who}'`;
        }
        else {
            who = 'None';
        }
        const code = `import lychee\nlychee.signals.outbound.${direction}_FORMAT.emit(dtype=${dtype}, who=${who}${extra})`;
        fujian.sendWS(code);
    },
    /** Emit Lychee's "outbound.REGISTER_FORMAT" signal.
     *
     * @param {str} dtype - Which dtype to register for outbound conversion.
     * @param {str} who - An identifier for the component requiring the registration.
     * @param {bool} outbound - Whether to run the "outbound" conversion immediately, producing
     *     data in this format without requiring a change in the document.
     */
    registerOutboundFormat(dtype, who, outbound) {
        if (outbound) {
            emitters._regOutboundFormat('REGISTER', dtype, who, ', outbound=True');
        }
        else {
            emitters._regOutboundFormat('REGISTER', dtype, who);
        }
    },
    /** Emit Lychee's "outbound.UNREGISTER_FORMAT" signal.
     *
     * @param {str} dtype - Which dtype to unregister.
     * @param {str} who - The "who" argument provided on registration.
     */
    unregisterOutboundFormat(dtype, who) {
        emitters._regOutboundFormat('UNREGISTER', dtype, who);
    },

    /** Show a DialogueBox.
     *
     * If the "type" is "question," the DialogueBox displays an <input type="text"> element, and
     * the answer is provided as the single argument to the "callback" function.
     *
     * @param {object} props - A JavaScript object with four members described below.
     * @param {string} props.type - Describing the type of dialogue box (one of "error", "warn",
     *        "info", "debug", or "question").
     * @param {string} props.message - A one sentence message for the user.
     * @param {string} props.detail - An optional detailed description of the message.
     * @param {function} props.callback - An optional function to call when the user dismisses (or
     *        closes) the DialogueBox. If "props.type" is "question," this function is called with
     *        "answer" as the only argument; otherwise there are no arguments.
     * @returns {undefined}
     */
    dialogueBoxShow(props) {
        reactor.dispatch(names.DIALOGUEBOX_SHOW, props);
    },
    /** Hide the DialogueBox React component.
     * @returns {undefined}
     */
    dialogueBoxHide() {
        reactor.dispatch(names.DIALOGUEBOX_HIDE);
    },

    /** Move the cursor marking the currently active <section>.
     *
     * @param {array of string} movement - Instructions to move the cursor to the <section> that
     *    should become active.
     *
     * The cursor is moved similarly to how one moves through a filesystem in UNIX-like operating
     * system shells. The argument to this function is understood as a "path" to the <section> that
     * will become active. Thus, if an array element is:
     *    - the string ".." it means to "go up a level";
     *    - the string "/" it means refers to the document root; and
     *    - a string with the @xml:id of a <section> it means to select that section, which must
     *      be a subsection of the previously-selected section.
     *
     * Consider the following <section> hierarchy:
     *
     * <section xml:id="1"/>
     *    <section xml:id="2"/>
     *       <section xml:id="3"/>
     *    <section xml:id="4"/>
     *    <section xml:id="5"/>
     * <section xml:id="6"/>
     *    <section xml:id="7"/>
     *    <section xml:id="8"/>
     *
     * If the cursor were ['1', '2', '3'] the only possible movements begin with '/' or '..' because
     * section 3 does not have any subsections. If the cursor were an empty list (meaning the
     * document root is selected) then '..' is not a valid movement because the root is not contained
     * in another section. If the cursor were ['6'] indicating that section 6 is selected, the cursor
     * could be moved to section 1 either with the path ['..', '1'] or ['/', '1'].
     *
     * Use ['/'] to indicate that no <section> should be selected.
     */
    moveSectionCursor(movement) {
        // Basically we're going to make sure "movement" is an "absolute path" in the score.
        // const sections = reactor.evaluate(getters.sections);
        let cursor = reactor.evaluate(getters.sectionCursor);

        for (const move of movement) {
            if ('/' === move) {
                cursor = Immutable.List();
            }
            else if ('..' === move) {
                cursor = cursor.pop();
            }
            else {
                cursor = cursor.push(move);
            }
        }

        reactor.dispatch(names.MOVE_SECTION_CURSOR, cursor);
    },
};


const signals = {names: names, emitters: emitters};
export {signals, names, emitters};
export default signals;
