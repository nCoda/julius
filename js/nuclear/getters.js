// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/nuclear/getters.js
// Purpose:                NuclearJS getters.
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

import {Immutable} from 'nuclear-js';


/** Produce a "flattened" Map of the MEI header data.
 *
 * Whereas the "headers" Store itself is structured the same way as an MEI XML document, this
 * function outputs a Map wherein the keys are human-readable field names, plus the values.
 *
 * @param {ImmutableJS.Map} headers - The value of the "headers" Store.
 * @returns {ImmutableJS.OrderedMap} A "flattened" version of the MEI header data.
 */
function headerFlattener(headers) {
    let post = Immutable.OrderedMap();

    function assign(field, value) {
        // Assign "value" to "field" in post---but only if "value" is something.
        if (value) {
            post = post.set(field, value);
        }
    }

    // titleStmt
    assign('Title', headers.getIn(['fileDesc', 'titleStmt', 'main']));
    assign('Subtitle', headers.getIn(['fileDesc', 'titleStmt', 'subordinate']));
    assign('Abbreviated Title', headers.getIn(['fileDesc', 'titleStmt', 'abbreviated']));
    assign('Alternative Title', headers.getIn(['fileDesc', 'titleStmt', 'alternative']));

    // people with roles
    assign('Arranger', headers.getIn(['fileDesc', 'arranger', 'full']));
    assign('Author', headers.getIn(['fileDesc', 'author', 'full']));
    assign('Composer', headers.getIn(['fileDesc', 'composer', 'full']));
    assign('Editor', headers.getIn(['fileDesc', 'editor', 'full']));
    assign('Funder', headers.getIn(['fileDesc', 'funder', 'full']));
    assign('Librettist', headers.getIn(['fileDesc', 'librettist', 'full']));
    assign('Lyricist', headers.getIn(['fileDesc', 'lyricist', 'full']));
    assign('Sponsor', headers.getIn(['fileDesc', 'sponsor', 'full']));

    // respStmt (repository contributors without roles)
    if (headers.getIn(['fileDesc', 'respStmt'])) {
        const respStmt = headers.getIn(['fileDesc', 'respStmt']).map((person) => {
            return person.get('full');
        });
        assign('Contributors', respStmt.join(', '));
    }

    // pubStmt
    assign('Publication', headers.getIn(['fileDesc', 'pubStmt', 'unpub']));

    return post;
}


/** Make the SectionCursor store "friendly" by interleaving @xml:id and "sections."
 *
 * @param {ImmutableJS.List} cursor - The cursor itself, as a List of @xml:id attributes.
 * @returns {ImmutableJS.List} The cursor with "sections" interleaved between @xml:id attributes.
 *
 * This function makes the following modification, so that callers can use getIn() on the Section
 * store without doing the interleaving themselves.
 *    Input:  ['123']
 *    Output: ['123']
 *    Input:  []
 *    Output: []
 *    Input:  ['123', '996']
 *    Output: ['123', 'sections', '996']
 *
 */
export function cursorFriendlyMaker(cursor) {
    let post = cursor;
    if (post.count() > 1) {
        post = post.reduce((previous, current) => {
            previous = previous.push(current);
            previous = previous.push('sections');
            return previous;
        }, Immutable.List());
        post = post.butLast();
    }
    return post;
}


export const getters = {
    headers: ['headers'],
    headersFlat: [['headers'], headerFlattener],  // for human-readable names in a "flat" Object
    sections: ['sections'],
    sectionCursor: ['sectionCursor'],
    sectionCursorFriendly: [['sectionCursor'], cursorFriendlyMaker],
    meiForVerovio: ['meiForVerovio'],
    sectionContextMenu: ['sectionContextMenu'],
    lilypond: ['lilypond'],
};

export default getters;
