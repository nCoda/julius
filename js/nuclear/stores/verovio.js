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

import {log} from '../../util/log';

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
        this.on(signals.names.ADD_NEW_VIDAVIEW, addNewVidaView);
        this.on(signals.names.DESTROY_VIDAVIEW, destroyVidaView);
        this.on(signals.names.RENDER_TO_VEROVIO, renderToVerovio);
    }
});

function addNewVidaView(previousState, payload) // payload.sectID, payload.parentElement
{
    if (previousState) previousState = previousState.toJS();

    if (payload.sectID in previousState) 
    {
        console.warn("Duplicate sectID " + payload.sectID + " in verovio store - shouldn't be happening.");
    }
    else
    {
        let vidaView = new VidaView({
            parentElement: payload.parentElement,
            controller: vidaController,
            iconClasses: {
                nextPage: 'am-icon-arrow-right',
                prevPage: 'am-icon-arrow-left',
                zoomIn: 'am-icon-plus-circle',
                zoomOut: 'am-icon-minus-circle'
            }
        });

        let viewIndex = viewsArr.push(vidaView) - 1; // push returns length, we want index
        previousState[payload.sectID] = viewIndex;
    }

    return toImmutable(previousState);
};

function destroyVidaView(previousState, payload) // payload is sectID
{
    if (previousState) 
    {
        previousState = previousState.toJS();
    }

    if (payload in previousState)
    {
        var vidaIdx = previousState[payload];
        viewsArr[vidaIdx].destroy();
        delete viewsArr[vidaIdx];
        viewsArr.splice(vidaIdx, 1);
        delete previousState[payload];
    }
    else 
    {
        log.warn("Tried to destroy VidaView for sectID " + payload + " - not active.");
    }

    return toImmutable(previousState);
};

function renderToVerovio(previousState, payload) {
    if (previousState) previousState = previousState.toJS();

    // there's a better way to do this but JS regex reacharounds don't exist
    let firstID = payload.match(/xml:id="[^"]*/i)[0].split('xml:id="')[1];

    // If something in the state is a number, it represents the index in viewsArr
    if (firstID in previousState) viewsArr[previousState[firstID]].refreshVerovio(payload);
    // Else there's still no vidaView for that MEI, so just set it as a string
    else console.error("renderToVerovio called for a section that does not have a registered VidaView yet.");

    return toImmutable(previousState);
}


export default {
    MeiForVerovio: MeiForVerovio,
};
