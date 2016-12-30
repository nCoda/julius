// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/stores/lilypond.js
// Purpose:                Redux store that holds LilyPond representations of the active document.
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

import store from './index';
import { getters as docGetters, types as docTypes } from './document';

/**
 * Root Store
 * ----------
 * @param {number} data - The "Data Map." See below.
 *
 * I predict we'll need to keep additional metadata in the root store, so that's why the LilyPond
 * sections themselves aren't stored in the root.
 *
 *
 * Data Map
 * --------
 * For the "data" field of the root store. Keys are the @xml:id of an LMEI <section> and values are
 * "Section Map" described below.
 *
 *
 * Section Map
 * -----------
 * Values of the "Data Map" described above.
 *
 * @param {string} latest - The most recent representation of the section provided by Lychee.
 * @param {string} working - The section as it is currently (or was most recently) shown in CodeView.
 *
 * I predict we'll need to keep multiple revisions in each Section Map. For now, the "latest" will
 * represent a "known good" condition of the document that we obtained from Lychee. The "working"
 * version will be consistent with what the user sees in CodeView, whether or not it has recently
 * (or ever) been sent to Lychee.
 *
 * You think it's complex and difficult to maintain two versions of something that's supposed to be
 * almost the same? Yes. But it will allow us to save the user's work when they've written some
 * LilyPond that isn't valid, and it will also allow us to save the user's formatting.
 */

export const types = {
    // TODO: implement this for submitting to Lychee
    UPDATE_WORKING: 'update working copy of LilyPond of a section',
};


export const actions = {
    /** updateWorking()
     *
     * @param {string} xmlid
     * @param {string} doc
     */
    updateWorking(xmlild, doc) {
        if (store.getState().lilypond.hasIn(['data', xmlid])) {
            if (doc && typeof doc === 'string') {
                store.dispatch({type: types.UPDATE_WORKING, payload: doc});
            }
            else {
                store.dispatch({
                    type: types.UPDATE_WORKING,
                    error: true,
                    payload: new Error('Invalid LilyPond'),
                });
            }
        }
        else {
            store.dispatch({
                type: types.UPDATE_WORKING,
                error: true,
                payload: new Error('Unknown section ID'),
            });
        }
    },
};


export const getters = {
    /** current() - LilyPond of the currently active section as most recently given by Lychee.
     */
    current(state) {
        return state.lilypond.getIn(['data', docGetters.cursor(state).first(), 'latest'], '');
    },

    /** working() - LilyPond of the currently active section; prefer the "working" version, but
     *              give the authoritative Lychee copy if the "working" version is not present.
     */
    working(state) {
        const section = state.lilypond.getIn(['data', docGetters.cursor(state).first(), 'working'], '');
        return section ? section : current(state);
    },
};


export function makeInitialState() {
    return Immutable.Map({data: Immutable.Map()});
}


export function makeEmptySection() {
    return Immutable.Map({latest: '', working: ''});
}


export const verifiers = {
    /** updatedSections() - For the UPDATED_SECTIONS action type.
     *
     * @param {ImmutableList} newSections - @xml:id of <section> we now have in the document.
     * @param {ImmutableMap} prev - Previous state of the "lilypond" store.
     *
     * Sections that are in "prev" but not "newSections" will be removed.
     * Sections that are not in not in "prev" but are in "newSections" will be added.
     * Sections that are in both parameters will be retained.
     */
    updatedSections(newSections, prev = makeInitialState()) {
        let post = prev.get('data');
        // remove sections
        post = post.filter((value, key) => newSections.includes(key));
        // add sections
        for (const sectionID of newSections.values()) {
            if (!post.has(sectionID)) {
                post = post.set(sectionID, makeEmptySection());
            }
        }

        return Immutable.Map({data: post});
    },
}


export default function reducer(state = makeInitialState(), action) {
    switch (action.type) {
        case docTypes.UPDATED_SECTIONS:
            return verifiers.updatedSections(docGetters.sectionIDs(store.getState()), state);

        case docTypes.UPDATE_SECTION_DATA:
            if (action.error !== true) {
                if (action.meta && action.meta.dtype && action.meta.dtype === 'lilypond') {
                    // TODO: don't assume "action.meta.placement" is valid
                    return state.setIn(['data', action.meta.placement, 'latest'], action.payload);
                }
            }
            break;

        case types.UPDATE_WORKING:
            if (action.error !== true) {
                const cursor = docsGetters.cursor(store.getState());
                return state.setIn(['data', cursor.last(), 'working']);
            }
            break;

        case 'RESET':
            return makeInitialState();
    }

    return state;
}
