// -*- coding: utf-8 -*-
//-------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/nuclear/stores/stdio.js
// Purpose:                NuclearJS Stores related to stdin, stdout, and stderr.
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


import {Store, toImmutable} from 'nuclear-js';
import signals from '../signals';


var Stdin = Store({
    // Representing everything that has been written to stdin during an editing session.
    //

    getInitialState() {
        return toImmutable([]);
    },
    initialize() {
        this.on(signals.names.STDIN, stdioAppender);
    }
});
var Stdout = Store({
    // Representing everything that has been written to stdout during an editing session.
    //

    getInitialState() {
        return toImmutable([]);
    },
    initialize() {
        this.on(signals.names.STDOUT, stdioAppender);
    }
});
var Stderr = Store({
    // Representing everything that has been written to stderr during an editing session.
    //

    getInitialState() {
        return toImmutable([]);
    },
    initialize() {
        this.on(signals.names.STDERR, stdioAppender);
    }
});


function stdioAppender(previousState, payload) {
    // Append the payload to the current state.
    //
    // Payload: A string to append to state.
    //

    return previousState.push(payload);
};

export default {
    Stdin: Stdin,
    Stdout: Stdout,
    Stderr: Stderr,
};
