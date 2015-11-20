// NuclearJS Store for Julius, the nCoda user interface.
//
// File Name: js/julius/stores/stdio.src.js
// Purpose: NuclearJS stores for stdin, stdout, and stderr information in Julius.
//
// Copyright 2015 Christopher Antila
//

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
