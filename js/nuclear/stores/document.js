// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/nuclear/stores/document.js
// Purpose:                NuclearJS Stores related to MEI documents.
//
// Copyright (C) 2015, 2016 Christopher Antila
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

// TODO: move the "headers" store here to reflect it's from the "document" thing in Lychee


const document = {
    /** Holds the "sections" object produced by Lychee's "document_outbound" converter. */
    Sections: Store({
        getInitialState() {
            return toImmutable({});
        },
        initialize() {
            this.on(signals.names.SECTIONS_FROM_LYCHEE, sectionsFromLychee);
        },
    }),
};


/** Accept a new "sections" object from Lychee.
 *
 * @param {ImmutableJS.Map} currentState - Ignored.
 * @param {Object} payload - Converted to an ImmutableJS.Map and returned.
 * @returns {ImmutableJS.Map} The Store's new state.
 *
 * This function effectively overwrites the Store's existing state with the new data. We intend it
 * to be used only with data from Lychee, our Source Of Truth.
 */
function sectionsFromLychee(currentState, payload) {
    return toImmutable(payload);
}


export {document};
export default document;
