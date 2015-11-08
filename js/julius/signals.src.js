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


import reactor from './reactor.src';


// TODO: should be "const" but Atom's symbol-list sidebar doesn't pick that up yet
// "names" is NuclearJS "actionTypes."
var names = {
    // HeaderBar
    ADD_HEADER: 1,
    CHANGE_HEADER: 2,
    REMOVE_HEADER: 3,
    // Mercurial stuff
    HG_ADD_CHANGESET: 4,
    // MEI Document Stuff
    SCOREDEF_INSTR_ADD: 5,  // to add an instrument to the score
    SCOREDEF_INSTRGRP_ADD: 6,  // to add a group of instruments to the score
};


// TODO: const?????
// "emitters" is NuclearJS "actions."
// They're added all throughout this file.
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
    // The argument may have any of the fields defined for the mercurial.ChangesetHistory store.
    reactor.dispatch(names.HG_ADD_CHANGESET, changeset);
};


// MEI Document Stuff
emitters['addInstrument'] = function(instrument) {
    // Add an instrument to the active document.
    // Fields for the "instrument" object are defined for the document.scoreDef.Instrument store.
    reactor.dispatch(names.SCOREDEF_INSTR_ADD, instrument);
};
emitters['addInstrumentGroup'] = function(instruments) {
    // Add an instrument to the active document.
    // The "instruments" argument should be an array of objects as defined for the
    // document.scoreDef.Instrument store.
    reactor.dispatch(names.SCOREDEF_INSTRGRP_ADD, instruments);
};


export default {names: names, emitters: emitters};
