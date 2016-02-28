// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/nuclear/stores/document.js
// Purpose:                NuclearJS Stores related to MEI documents.
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
import {cursorFriendlyMaker, getters} from '../getters';
import signals from '../signals';
import reactor from '../reactor';


const document = {
    /** Mark the <section> current being edited.
     *
     * The cursor is a List of @xml:id attributes as they appear in nested <section> elements in
     * the Sections store. If the List is empty, it means no <section> is selected and the cursor
     * effectively points to the document root. Otherwise, the Cursor might look like one of the
     * following examples:
     *
     *    List(['Sme-s-m-l-e9029823'])
     *    --> points to a top-level <section>
     *
     *    List(['Sme-s-m-l-e9176572', 'Sme-s-m-l-e9029823'])
     *    --> points to <section> e9029823, a subsection of e9176572
     */
    Cursor: Store({
        getInitialState() {
            return toImmutable([]);
        },
        initialize() {
            this.on(signals.names.MOVE_SECTION_CURSOR, moveSectionCursor);
        },
    }),

    /** Holds the "headers" object produced by Lychee's "document_outbound" convert. */
    Headers: Store({
        getInitialState() {
            return toImmutable([]);
        },
        initialize() {
            this.on(signals.names.HEADERS_FROM_LYCHEE, replaceWithLychee);
        },
    }),

    /** Holds the "sections" object produced by Lychee's "document_outbound" converter. */
    Sections: Store({
        getInitialState() {
            return toImmutable({});
        },
        initialize() {
            this.on(signals.names.SECTIONS_FROM_LYCHEE, replaceWithLychee);
        },
    }),
};


/** Accept a new object from Lychee.
 *
 * @param {ImmutableJS.Map} currentState - Ignored.
 * @param {Object} payload - Converted to an ImmutableJS.Map and returned.
 * @returns {ImmutableJS.Map} The Store's new state.
 *
 * This function effectively overwrites the Store's existing state with the new data. We intend it
 * to be used only with data from Lychee, our Source Of Truth.
 */
function replaceWithLychee(currentState, payload) {
    return toImmutable(payload);
}


/** Move the cursor that indicates the currently-selected <section>.
 *
 * @param {ImmutableJS.List} currentState - Path to the currently-selected <section>.
 * @param {array of str} payload - List of @xml:id attributes giving the "path" to a <section>.
 * @returns {ImmutableJS.List} The store's new state if it is valid, otherwise the old cursor.
 *
 * Do note that this function requires an "absolute" path, starting from the document root. Thus it
 * is important to call the moveSectionCursor() signal, which produces the output required in this
 * function.
 */
function moveSectionCursor(currentState, payload) {
    if (reactor.evaluate(getters.sections).hasIn(cursorFriendlyMaker(payload))) {
        return toImmutable(payload);
    }
    else {

        return currentState;
    }
}


export {document};
export default document;
