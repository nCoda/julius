// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
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
// ------------------------------------------------------------------------------------------------


import {Store, toImmutable} from 'nuclear-js';
import signals from '../signals';


const MetadataHeaders = Store({
    getInitialState() {
        return toImmutable([]);
    },
    initialize() {
        this.on(signals.names.ADD_HEADER, addHeader);
        this.on(signals.names.CHANGE_HEADER, changeHeader);
        this.on(signals.names.REMOVE_HEADER, removeHeader);
    },
});


/** Add a new header field.
 * @param {ImmutableJS.Map} currentState - As it says.
 * @param {Object} payload - An Object with "name" and "value" members, both strings, which are the
 *     desired name and value for the new field.
 * @returns {ImmutableJS.Map} The Store's new state.
 */
function addHeader(currentState, payload) {
    return currentState.push(toImmutable({name: payload.name, value: payload.value}));
}


/** Modify an existing header field.
 * @param {ImmutableJS.Map} currentState - As it says.
 * @param {Object} payload - An Object with "name" and "value" members, both strings, which are the
 *     desired name and value of the field to modify.
 * @returns {ImmutableJS.Map} The Store's new state.
 */
function changeHeader(currentState, payload) {
    let replaceToIndex = null;
    for (const header of currentState.entries()) {
        if (header[1].get('name') === payload.name) {
            replaceToIndex = header[0];
            break;
        }
    }

    // TODO: figure out how you're supposed to do this with bullshit ImmutableJS data structures
    const newState = currentState.toArray();
    newState[replaceToIndex] = toImmutable({name: payload.name, value: payload.value});

    return toImmutable(newState);
}


/** Remove an existing header field.
 * @param {ImmutableJS.Map} currentState - As it says.
 * @param {Object} payload - An Object with a "name" string, containing the field name to remove.
 * @returns {ImmutableJS.Map} The Store's new state.
 */
function removeHeader(currentState, payload) {
    let removeIndex = null;
    for (const header of currentState.entries()) {
        if (header[1].get('name') === payload.name) {
            removeIndex = header[0];
            break;
        }
    }

    // TODO: figure out how you're supposed to do this with bullshit ImmutableJS data structures
    const state = currentState.toArray();
    const partOne = state.slice(0, removeIndex);
    const partTwo = state.slice(removeIndex + 1, state.length);
    const newState = partOne.concat(partTwo);

    return toImmutable(newState);
}


export default {MetadataHeaders: MetadataHeaders};
