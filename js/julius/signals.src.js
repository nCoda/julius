// Signals: NuclearJS Actions and ActionTypes for Julius, the nCoda user interface.
//
// File Name: js/julius/signals.src.js
// Purpose: NuclearJS Actions and ActionTypes for Julius.
//
// Copyright 2015 Christopher Antila
//
// Note: This module is called "signals" so that nCoda has a consistent relationship between its
//       Python and JavaScript worlds. In JavaScript, our NuclearJS "actionTypes" are effectively
//       the names of signals, and "actions" are effectively the signals' "emit" functions.
//


import keyMirror from 'react/lib/keyMirror';
import reactor from './reactor.src';


// TODO: should be "const" but Atom's symbol-list sidebar doesn't pick that up yet
// "names" is NuclearJS "actionTypes."
var names = keyMirror({
    // HeaderBar
    ADD_HEADER: null,
    CHANGE_HEADER: null,
    REMOVE_HEADER: null,
    // Mercurial stuff
    HG_ADD_CHANGESET: null
});


// TODO: const?????
// "emitters" is NuclearJS "actions."
var emitters = {};


emitters['addHeader'] = function(name, value) {
    // The name and value of the header to add.
    reactor.dispatch(names.ADD_HEADER, {name: name, value: value});
};

emitters['changeHeader'] = function(name, value) {
    // The name of an existing header and its new value.
    reactor.dispatch(names.CHANGE_HEADER, {name: name, value: value});
};

emitters['removeHeader'] = function(name) {
    // The name of an existing header.
    reactor.dispatch(names.REMOVE_HEADER, {name: name})
};

// Mercurial stuff
emitters['hgAddChangeset'] = function(changeset) {
    // The argument may have any of the following fields:
    //     changeset: '',
    //     tag: '',
    //     name: '',
    //     email: '',
    //     username: '',
    //     date: '',
    //     summary: '',
    //     parents: [],
    //     children: [],
    //     files: [],
    //     diffAdded: 0,
    //     diffRemoved: 0
    //

    reactor.dispatch(names.HG_ADD_CHANGESET, changeset);

};


export default {names: names, emitters: emitters};
