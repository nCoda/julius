// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/nuclear/stores/verovio.js
// Purpose:                NuclearJS Stores related to Verovio.
//
// Copyright (C) 2016 Christopher Antila, Andrew Horwitz
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
import getters from '../getters';
import reactor from '../reactor';
import {VidaController, VidaView} from '../../lib/vida';

const vidaController = new VidaController({
    'workerLocation': 'js/lib/verovioWorker.js',
    'verovioLocation': '../verovio-toolkit-0.9.9.js'
});

const viewsArr = [];

const MeiForVerovio = Store({
    // Represents an object mapping root xml:id of each MEI section rendered in Verovio to the index of its corresponding vidaView.

    getInitialState() {
        return toImmutable({});
    },

    initialize() {
        this.on(signals.names.ADD_NEW_VIDAVIEW, addNewVidaView)
        this.on(signals.names.RENDER_TO_VEROVIO, renderToVerovio);
    }
});

function addNewVidaView(previousState, payload, mei)
{
    if (previousState) previousState = previousState.toJS();

    let vidaView = new VidaView({
        parentElement: payload.parentElement,
        controller: vidaController
    });

    let viewIndex = viewsArr.push(vidaView) - 1; // push returns length, we want index

    if (payload.sectID in previousState) // it's going to be a string representation of the MEI
        vidaView.refreshVerovio(previousState[payload.sectID]);

    previousState[payload.sectID] = viewIndex;

    return toImmutable(previousState);
};

function renderToVerovio(previousState, payload) {
    if (previousState) previousState = previousState.toJS();

    let firstID = payload.match(/xml:id="[^"]*/i)[0].split('xml:id="')[1]; // there's a better way to do this but JS regex reacharounds aren't cooperating

    // If something in the state is a number, it represents the index in viewsArr
    if ((firstID in previousState) && (typeof previousState[firstID] === "number"))
            viewsArr[previousState[firstID]].refreshVerovio(payload);
    // Else there's still no vidaView for that MEI, so just set it as a string
    else
        previousState[firstID] = payload;        

    return toImmutable(previousState);
}


export default {
    MeiForVerovio: MeiForVerovio,
};
