// NuclearJS Store for Julius, the nCoda user interface.
//
// File Name: js/julius/stores/document.src.js
// Purpose: NuclearJS stores for MEI Document information in Julius.
//
// Copyright 2015 Christopher Antila
//

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
        }
    })
};


function makeNewInstrument(fromThis) {
    // Given a "fromThis" object, this function returns a new ImmutableJS Map with all the default
    // fields containing default values, and any fields in "fromThis" too.
    //
    return toImmutable({
        label: fromThis.label || ''
    });
};


function addInstrument(previousState, payload) {
    // Make a new <instrDef> and put it in the Instrument store.
    //
    // Payload: An object that may have any of the fields defined for a Instruments object.
    //     Other fields are ignored.
    //

    return previousState.push(makeNewInstrument(payload));
};


function addInstrumentGroup(previousState, payload) {
    // Make a new <instrGrp> and put it in the Instrument store.
    //
    // Payload: An arry of objects that may have any of the fields defined for a Instruments object.
    //     Other fields are ignored.
    //

    return previousState.push(toImmutable(payload.map(makeNewInstrument)));
};


export default {
    scoreDef: scoreDef
};
