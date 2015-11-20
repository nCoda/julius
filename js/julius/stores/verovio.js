// NuclearJS Store for Julius, the nCoda user interface.
//
// File Name: js/julius/stores/verovio.src.js
// Purpose: NuclearJS stores for Verovio in Julius.
//
// Copyright 2015 Christopher Antila
//

import {Store, toImmutable} from 'nuclear-js';
import signals from '../signals';


// TODO: move all the Verovio-rendering stuff to here.


const MeiForVerovio = Store({
    // Representing the MEI document to send to Verovio.
    //
    // This should be a string.
    //

    getInitialState() {
        return toImmutable('');
    },
    initialize() {
        this.on(signals.names.RENDER_TO_VEROVIO, renderToVerovio);
    }
    });


function renderToVerovio(previousState, payload) {
    return toImmutable(payload);
};


export default {
    MeiForVerovio: MeiForVerovio
};
