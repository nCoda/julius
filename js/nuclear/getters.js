// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/nuclear/getters.js
// Purpose:                NuclearJS getters.
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


import {Immutable} from 'nuclear-js';


/** Concatenate a List of strings into a single string with newlines.
 * @param {ImmutableJS.List of str} output - The List of strings to concatenate.
 * @returns {str} The concatenated string.
 */
function stdioConcatter(output) {
    return output.join('\n');
}


/** vcsUsers() - Extract an ImmutableJS Map of user data from the revlog.
 *
 * @param {ImmutableJS.Map} revlog - Data from the mercurial.Revlog Store.
 * @returns {ImmutableJS.List} A list of Map objects representing a user. Each user has "rname"
 *    and "email" fields, each of which is a string, and "changesets," which is a List of strings,
 *    each of which is the hexadecimal hash of a changeset for which the user is responsible. The
 *    "changesets" List will be in chronological order, so the last element is the has of the most
 *    recent changeset.
 */
function vcsUsers(revlog) {
    // TODO: when we have nCoda usernames, maybe that could be returned here?
    // TODO: there are no tests for this
    const usersMap = revlog.get('users');
    const post = [];
    for (const user of usersMap.keys()) {
        post.push(Immutable.Map({
            name: user.slice(0, user.indexOf('<') - 1),
            email: user.slice(user.indexOf('<')),
            changesets: usersMap.get(user),
        }));
    }
    return new Immutable.List(post);
}


/** vcsChangesets() - Extract an ImmutableJS Map of changesets from the revlog.
*
* @param {ImmutableJS.Map} revlog - Data from the mercurial.Revlog Store.
* @returns {ImmutableJS.List} A list of Map objects representing a user. Each user has "rname"
*    and "email" fields, each of which is a string, and "changesets," which is a List of strings,
*    each of which is the hexadecimal hash of a changeset for which the user is responsible. The
*    "changesets" List will be in chronological order, so the last element is the has of the most
*    recent changeset.
*/
function vcsChangesets(revlog) {
    return revlog.get('changesets');
}


/** Produce a "flattened" Map of the MEI header data.
 *
 * Whereas the "headers" Store itself is structured the same way as an MEI XML document, this
 * function outputs a Map wherein the keys are human-readable field names, plus the values.
 *
 * @param {ImmutableJS.Map} headers - The value of the "headers" Store.
 * @returns {ImmutableJS.Map} A "flattened" version of the MEI header data.
 */
function headerFlattener(headers) {
    const post = {};

    // titleStmt
    post['Title'] = headers.getIn(['fileDesc', 'titleStmt', 'main']);
    post['Subtitle'] = headers.getIn(['fileDesc', 'titleStmt', 'subordinate']);

    // pubStmt
    post['Publication'] = headers.getIn(['fileDesc', 'pubStmt', 'unpub']);

    return Immutable.Map(post);
}


const getters = {
    headers: ['headers'],
    headersFlat: [['headers'], headerFlattener],  // for human-readable names in a "flat" Object
    listOfInstruments: ['instruments'],
    stdin: [['stdin'], stdioConcatter],
    stdout: [['stdout'], stdioConcatter],
    stderr: [['stderr'], stdioConcatter],
    meiForVerovio: ['meiForVerovio'],
    sectionContextMenu: ['sectionContextMenu'],
    logLevel: ['logLevel'],
    DialogueBox: ['DialogueBox'],
    vcsUsers: [['revlog'], vcsUsers],
    vcsChangesets: [['revlog'], vcsChangesets],
};

export {getters, stdioConcatter};
export default getters;
