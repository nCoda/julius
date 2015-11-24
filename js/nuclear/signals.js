// -*- coding: utf-8 -*-
//-------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/nuclear/signals.js
// Purpose:                NuclearJS Actions and ActionTypes.
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

// Note: This module is called "signals" so that nCoda has a consistent relationship between its
//       Python and JavaScript worlds. In JavaScript, our NuclearJS "actionTypes" are effectively
//       the names of signals, and "actions" are effectively the signals' "emit" functions.
//

import {log} from '../util/log';
import reactor from './reactor';
import {fujianStart, fujianStop, submitToFujianWs, submitToFujianAjax} from '../util/fujian';


// TODO: should be "const" but Atom's symbol-list sidebar doesn't pick that up yet
// "names" is NuclearJS "actionTypes."
const names = {
    // HeaderBar
    ADD_HEADER: 1,
    CHANGE_HEADER: 2,
    REMOVE_HEADER: 3,
    // Mercurial stuff
    HG_ADD_CHANGESET: 4,
    // MEI Document Stuff
    SCOREDEF_INSTR_ADD: 5,  // to add an instrument to the score
    SCOREDEF_INSTRGRP_ADD: 6,  // to add a group of instruments to the score
    // Standard I/O
    STDIN: 7,
    STDOUT: 8,
    STDERR: 9,
    // Verovio
    RENDER_TO_VEROVIO: 10,
    // Fujian PyPy Server (currently doesn't affect NuclearJS)
    FUJIAN_START_WS: 11,
    FUJIAN_RESTAT_WS: 12,
    FUJIAN_CLOSE_WS: 13,
    // StructureView stuff
    SECTIO_CONTEXT_MENU: 14,
    // Logging
    SET_LOG_LEVEL: 15,
};


// "emitters" is NuclearJS "actions."
const emitters = {
    // MEI headers
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
        reactor.dispatch(names.REMOVE_HEADER, {name: name})
    },

    // Mercurial stuff
    hgAddChangeset(changeset) {
        // The argument may have any of the fields defined for the mercurial.ChangesetHistory store.
        reactor.dispatch(names.HG_ADD_CHANGESET, changeset);
    },

    // MEI Document Stuff
    addInstrument(instrument) {
        // Add an instrument to the active document.
        // Fields for the "instrument" object are defined for the document.scoreDef.Instrument store.
        reactor.dispatch(names.SCOREDEF_INSTR_ADD, instrument);
    },
    addInstrumentGroup(instruments) {
        // Add an instrument to the active document.
        // The "instruments" argument should be an array of objects as defined for the
        // document.scoreDef.Instrument store.
        reactor.dispatch(names.SCOREDEF_INSTRGRP_ADD, instruments);
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
    renderToVerovio(mei) {
        reactor.dispatch(names.RENDER_TO_VEROVIO, mei);
    },

    // Fujian PyPy Server (currently doesn't affect NuclearJS)
    fujianStartWS() {
        fujianStart();
    },
    fujianRestartWS() {
        fujianStop();
        fujianStart();
    },
    fujianStopWS() {
        fujianStop();
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
            let code =    "import lychee\n"
                        + "from lychee import signals\n"
                        + "from lychee.signals import outbound\n"
                        + "\n"
                        + "def mei_listener(**kwargs):\n"
                        + "    outbound.I_AM_LISTENING.emit(dtype='mei')\n"
                        + "\n"
                        + "outbound.WHO_IS_LISTENING.connect(mei_listener)\n"
                        + "lychee.signals.ACTION_START.emit(dtype='LilyPond', doc='''" + data + "''')";

            submitToFujianWs(code);
        } else {
            log.error('submitToLychee() received an unknown "format" argument.');
        }
    },
    submitToPyPy(code) {
        // For code being submitted by the human user.
        //
        submitToFujianAjax(code);
    },

    // StructureView GUI state
    sectionContextMenu(style) {
        // Call this with an object that has "show" (boolean) and "left" and "top" (in pixels).
        //
        reactor.dispatch(names.SECTION_CONTEXT_MENU, style);
    },

    // Logging
    setLogLevel(to) {
        reactor.dispatch(names.SET_LOG_LEVEL, to);
    },
};


const signals = {names: names, emitters: emitters};
export {signals};
export default signals;
