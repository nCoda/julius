// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/nuclear/stores/lilypond.js
// Purpose:                NuclearJS Stores to hold LilyPond data.
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


import {Store, Immutable} from 'nuclear-js';
import signals from '../signals';
import reactor from '../reactor';

import log from '../../util/log.js';


const lilypond = {
    /** Hold the LilyPond representations of <section>s in the document. */
    Sections: Store({
        getInitialState() {
            return Immutable.Map();
        },
        initialize() {
            this.on(signals.names.LILYPOND_FROM_LYCHEE, lilypondFromLychee);
        },
    }),
};


/** Add a LilyPond string to the Sections Store.
 *
 * @param {Object} payload - With two members as described just below.
 * @param {str} payload.placement - XMLID of the <section>.
 * @param {str} payload.document - The LilyPond document.
 * @returns The updated Store.
 */
function lilypondFromLychee(previous, payload) {
    if (payload && payload.placement && payload.document &&
        typeof payload.placement === 'string' && typeof payload.document === 'string') {
        return previous.set(payload.placement, payload.document);
    }
    else {
        log.warn('LilyPond Store received incorrect update.');
        return previous;
    }
}


export {lilypond};
export default lilypond;
