// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/nuclear/stores/revisions.js
// Purpose:                NuclearJS Stores for the RevisionsView.
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
import {log} from '../../util/log';


const revisions = {
    /** Revisions
     *
     * It's a Map, organized by revision number, then data format, then section. For example:
     *
     * {
     *   '1': {
     *     'lilypond': {
     *       'Sme-s-m-l-e2223334': 'hatever'
     *     }
     *   },
     *   '2': {
     *     'lilypond': {
     *       'Sme-s-m-l-e2223334': 'whatever'
     *     }
     *   }
     * }
     *
     * ... you know!
     *
     * NOTE: it only takes "mei" and "lilypond" formats!
     */
    Revisions: Store({
        getInitialState() {
            return Immutable.Map();
        },
        initialize() {
            this.on(signals.names.REVISION_FROM_LYCHEE, addNewRevision);
        },
    }),
};


/** Do whatever.
 *
 * NOTE: it only takes "mei" and "lilypond" formats!
 */
function addNewRevision(store, revision) {
    if ((revision.dtype === 'lilypond' || revision.dtype === 'mei') &&
        (revision.placement && revision.placement !== 'None') &&
        (revision.changeset)) {
        // set it and forget it!
        let cset = revision.changeset;
        if (cset.indexOf(':') > -1) {
            cset = cset.slice(0, cset.indexOf(':'));
        }
        return store.setIn([cset, revision.dtype, revision.placement], revision.document);
    }
    else {
        return store;
    }
}


export default revisions;
export {revisions};
