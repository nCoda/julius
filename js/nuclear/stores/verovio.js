// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/nuclear/stores/verovio.js
// Purpose:                NuclearJS Stores related to Verovio.
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
    },
});


function renderToVerovio(previousState, payload) {
    return toImmutable(payload);
}


export default {
    MeiForVerovio: MeiForVerovio,
};
