// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/stores/document.js
// Purpose:                Redux store for the document currently open in nCoda.
//
// Copyright (C) 2017 Christopher Antila
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

import Immutable from 'immutable';

import { store } from './index';

/**
 * Most of the data in this store are provided by Lychee's "document" outbound converter.
 *
 * Root Store
 * ----------
 * @param {ImmutableList} cursor - The "document cursor," which points to an LMEI section that
 *     should be considered the position of active editing. The List contains a series of strings
 *     that are the @xml:id of <section> elements, starting with a top-level <section> and
 *     descending through the hierarchy.
 *     NOTE: for the MVP there is only one section, and the "cursor" is created on demand, so this field is not used
 * @param {ImmutableMap} sections - The "Sections Map" described below.
 *
 *
 * Sections Map
 * ------------
 * Value of the "sections" field in the root store.
 * @param {ImmutableList} score_order - With strings of @xml:id indicating the order of sections
 *     in the "active score" for this document.
 * @param {string} * - The other keys are the @xml:id of the sections, with values being the
 *     "Section Map" as described below.
 *
 *
 * Section Map
 * -----------
 * Value of most fields in the "Sections Map" described above. The rest of the fields provided by
 * Lychee will be added as they become necessary.
 * @param {string} xmlid
 * @param {string} label
 */

// NOTE: For the MVP, there is only one section, and the document cursor always points to it.


export const types = {
    // for "document" store only: causes the <section> s to be updated
    WILL_UPDATE_SECTIONS: 'will update the sections in the document',

    // For other stores: emitted after WILL_UPDATE_SECTIONS, once the "document" store is updated.
    // There is no payload; other stores can listen and use "document" getters as required.
    UPDATED_SECTIONS: 'did update the sections in the document',

    // For other stores: emitted when the representation of a <section> changes. With this type,
    // the "meta" field of the Flux Standard Action holds an object with these fields:
    //     - dtype: the Lychee "dtype" of the payload
    //     - placement: the Lychee "placement" of the payload
    UPDATE_SECTION_DATA: 'update section data',
};


export const actions = {
    /** updateSections()
     *
     * Update metadata about the sections in the document. Usually called with new data from Lychee.
     * This function dispatches both the WILL_UPDATE_SECTIONS action type (to update the "document"
     * store) and UPDATED_SECTIONS (to notify other stores to update).
     *
     * @param {object} doc - Data from Lychee's "document" outbound converter. This is the whole
     *     "document" argument emitted by the CONVERSION_FINISHED signal; for more information:
     *     https://lychee.ncodamusic.org/converters-document_out.html
     *
     * This function only dispatches the UPDATED_SECTIONS action type if the sections have changed,
     * but WILL_UPDATE_SECTIONS is always dispatched.
     */
    updateSections(doc) {
        if (doc && typeof doc === 'object' && doc.sections && typeof doc.sections === 'object') {
            const current = store.getState().document.get('sections');
            store.dispatch({type: types.WILL_UPDATE_SECTIONS, payload: doc.sections});
            if (!current.equals(store.getState().document.get('sections'))) {
                store.dispatch({type: types.UPDATED_SECTIONS});
            }
        }
        else {
            store.dispatch({
                type: types.WILL_UPDATE_SECTIONS,
                error: true,
                payload: new Error('updateSections(): very invalid argument'),
            });
        }
    },

    /** updateSectionData()
     */
    updateSectionData(dtype, placement, doc) {
        if (dtype && placement && doc) {
            store.dispatch({
                type: types.UPDATE_SECTION_DATA,
                meta: {dtype, placement},
                payload: doc,
            });
        }
    },
};


export const getters = {
    /** cursor() - Get a cursor pointing to the currently active <section> .
     *
     * @returns {ImmutableList} Currently, a one-element list with the section ID required.
     */
    cursor(state) {
        // TODO: this won't work with nested sections
        if (getters.cursorIsValid(state)) {
            return Immutable.List([state.document.getIn(['sections', 'score_order']).first()]);
        }
        else {
            return Immutable.List();
        }
    },

    /** cursorIsValid() - Returns true when the cursor points to a section we know about. */
    cursorIsValid(state) {
        // NB: for now, since the cursor is not settable, this returns true if the "cursor()"
        // getter will be able to construct the cursor
        return (
            state.document.getIn(['sections', 'score_order']).size > 0
            &&
            state.document.hasIn(['sections', state.document.getIn(['sections', 'score_order']).first()])
        );
    },

    /** section() - Metadata about the currently active section.
     *
     * @returns {ImmutableMap}
     *
     * If there is no active section, returns an empty template of section metadata.
     */
    section(state) {
        // TODO: will not work with nested sections
        if (getters.cursorIsValid(state)) {
            return state.document.getIn(['sections', state.document.getIn(['sections', 'score_order']).first()]);
        }
        else {
            return makeEmtpySection();
        }
    },

    /** sectionIDs() - Immutable.List of the unordered @xml:id of all <section> in the document.
     */
    sectionIDs(state) {
        return state.document.get('sections').toList().reduce((reduction, value) => {
            if (Immutable.List.isList(value)) {
                return reduction;
            }
            else {
                return reduction.push(value.get('xmlid'));
            }
        }, Immutable.List());
    },
};


export function makeInitialState() {
    return Immutable.Map({
        cursor: Immutable.List(),
        sections: makeEmptySections(),
    });
}


export function makeEmptySections() {
    return Immutable.Map({score_order: Immutable.List()});
}


export function makeEmptySection() {
    return Immutable.Map({label: '', xmlid: ''});
}


export const verifiers = {
    /** section() - For one section.
     *
     * Used by the sections() verifier.
     */
    section(next, previous = makeEmptySection()) {
        let post = previous.toJS();

        if (next.xmlid && typeof next.xmlid === 'string') {
            post.xmlid = next.xmlid;
        }
        if (next.label && typeof next.label === 'string') {
            post.label = next.label;
        }

        return Immutable.fromJS(post);
    },

    /** sections() - For the WILL_UPDATE_SECTIONS action type.
     *
     * Takes the "sections" member of output from Lychee's "document" outbound converter and
     * validates for the "document" store.
     */
    sections(next) {
        let post = makeEmptySections();

        for (const key of Object.keys(next)) {
            if (key === 'score_order') {
                if (next.score_order && Array.isArray(next.score_order)) {
                    // TODO: this only works with non-hierarchic scores
                    let errored = false;
                    for (const xmlid of next.score_order) {
                        if (!next[xmlid]) {
                            errored = true;
                        }
                    }
                    if (errored) {
                        // TODO: handle this error properly
                        console.error('The score_order has a nonexistant section');
                        return makeEmptySections();
                    }
                    else {
                        post = post.set('score_order', Immutable.List(next.score_order));
                    }
                }
                else {
                    // TODO: handle this error properly
                    console.error('The score_order is an invalid format');
                    return makeEmptySections();
                }
            }
            else {
                next[key].xmlid = key;
                const converted = verifiers.section(next[key]);
                if (key === converted.get('xmlid')) {
                    post = post.set(key, converted);
                }
                else {
                    // TODO: handle this error properly
                    console.error('An @xml:id was wrong');
                    return makeEmptySections();
                }
            }
        }

        return post;
    },
};


export function reducer(state = makeInitialState(), action) {
    switch (action.type) {
        case types.WILL_UPDATE_SECTIONS:
            if (action.error !== true) {
                return state.set('sections', verifiers.sections(action.payload));
            }

        case 'RESET':
            return makeInitialState();
    }

    return state;
}


export default reducer;
