// -*- coding: utf-8 -*-
//-------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/nuclear/stores/headerMetadata.js
// Purpose:                NuclearJS Stores related to MEI header metadata.
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
