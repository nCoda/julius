// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/nuclear/stores/verovio.js
// Purpose:                NuclearJS Stores related to Verovio.
//
// Copyright (C) 2016 Christopher Antila
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
import {Vida} from '../../lib/vida';


// TODO: move all the Verovio-rendering stuff to here.
const vida = new Vida();

const MeiForVerovio = Store({
    // Representing the MEI document to send to Verovio.
    //
    // This should be a string.
    //

    getInitialState() {
        return toImmutable('');
    },

    initialize() {
        // Called once to initialize the Vida object
        this.on(signals.names.INITIALIZE_VIDA, initializeVida);
        this.on(signals.names.LOAD_MEI, loadMEI);
        this.on(signals.names.RENDER_TO_VEROVIO, renderToVerovio);
    },
});


function initializeVida(previousState, vidaParams) 
{
    vida.setDefaults(vidaParams);
    if (this.mei) vida.refreshVerovio(this.mei);
}

function loadMEI(previousState, mei)
{
    this.mei = mei;
    if (this.vida) vida.refreshVerovio(this.mei);
}


function renderToVerovio(previousState, payload) {
    return toImmutable(payload);
}


export default {
    MeiForVerovio: MeiForVerovio,
};
