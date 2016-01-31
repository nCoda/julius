// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/nuclear/stores/document.js
// Purpose:                NuclearJS Stores related to MEI documents.
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


const scoreDef = {
    Instruments: Store({
        // Representing a list of <instrDef> in a <scoreDef>.
        //
        // For now, it corresponds to an <instrDef> and it only has the @label attribute.
        // So the "label" fields is the only one you can use.
        //
        // If an element in the store is an ImmutableJS Map, it corresponds to an <instrDef>. If an
        // element is an ImmutableJS List, it corresponds to an <instrGrp>, and the Map contained
        // Map objects are <instrDef>.
        //

        getInitialState() {
            return toImmutable([]);
        },
        initialize() {
            this.on(signals.names.SCOREDEF_INSTR_ADD, addInstrument);
            this.on(signals.names.SCOREDEF_INSTRGRP_ADD, addInstrumentGroup);
        },
    }),
};


/** Produce a new Map instance by combining fields from the argument with defaults.
 * @param {Object} fromThis - A base Object from which to copy fields for the instrument.
 * @returns {ImmutableJS.Map} A new instrument.
 */
function makeNewInstrument(fromThis) {
    return toImmutable({
        label: fromThis.label || '',
    });
}


/** Make a new <instrDef> and put it in the Instrument Store.
 * @param {ImmutableJS.Map} previousState - The previous state of the "Instrument" Store.
 * @param {Object} payload - An Object with any of the fields defined for an Instruments object.
 * @returns {ImmutableJS.Map} The Store's new state.
 */
function addInstrument(previousState, payload) {
    return previousState.push(makeNewInstrument(payload));
}


/** Make a new <instrGrp> and put it in the Instrument Store.
 * @param {ImmutableJS.Map} previousState - The previous state of the "Instrument" Store.
 * @param {Object} payload - An Array of Objects with fields defined for Instruments objects.
 * @returns {ImmutableJS.Map} The Store's new state.
 */
function addInstrumentGroup(previousState, payload) {
    return previousState.push(toImmutable(payload.map(makeNewInstrument)));
}


export default {
    scoreDef: scoreDef,
};
