// NuclearJS Store for Julius, the nCoda user interface.
//
// File Name: js/julius/stores/headerMetadata.src.js
// Purpose: NuclearJS Stores for MEI <header> metadata in Julius.
//
// Copyright 2015 Christopher Antila
//

import {Store, toImmutable} from 'nuclear-js';
import signals from '../signals.src';


var MetadataHeaders = Store({
    getInitialState() {
        return toImmutable([]);
    },
    initialize() {
        this.on(signals.names.ADD_HEADER, addHeader);
        this.on(signals.names.CHANGE_HEADER, changeHeader);
        this.on(signals.names.REMOVE_HEADER, removeHeader);
    }
});


function addHeader(currentState, payload) {
    // Add a new header field.
    //
    // Payload:
    // - name (str) Name for the new header field to add.
    // - value (str) Value of the new header field.
    //

    let newHeader = toImmutable({name: payload.name, value: payload.value});
    return currentState.push(newHeader);
};


function changeHeader(currentState, payload) {
    // Edit an existing header field.
    //
    // Payload:
    // Same as addHeader().
    //

    let replaceToIndex = null;
    for (let header of currentState.entries()) {
        if (header[1].get('name') === payload.name) {
            replaceToIndex = header[0];
            break;
        }
    }

    // TODO: figure out how you're supposed to do this with bullshit ImmutableJS data structures
    let newState = currentState.toArray();
    newState[replaceToIndex] = toImmutable({name: payload.name, value: payload.value});

    return toImmutable(newState);
};


function removeHeader(currentState, payload) {
    // Remove an existing header field.
    //
    // Payload:
    // Same as addHeader() but "value" is ignored if present.
    //

    let removeIndex = null;
    for (let header of currentState.entries()) {
        if (header[1].get('name') === payload.name) {
            removeIndex = header[0];
            break;
        }
    }

    // TODO: figure out how you're supposed to do this with bullshit ImmutableJS data structures
    let state = currentState.toArray();
    let partOne = state.slice(0, removeIndex);
    let partTwo = state.slice(removeIndex + 1, state.length);
    let newState = partOne.concat(partTwo);

    return toImmutable(newState);
};


export default {MetadataHeaders: MetadataHeaders};
