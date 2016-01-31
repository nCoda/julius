// -*- coding: utf-8 -*-
//-------------------------------------------------------------------------------------------------
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
//-------------------------------------------------------------------------------------------------


import {Immutable} from 'nuclear-js';


function stdioConcatter(output) {
    // Concatenates a List of strings into a single string.
    //
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
            'name': user.slice(0, user.indexOf('<') - 1),
            'email': user.slice(user.indexOf('<')),
            'changesets': usersMap.get(user),
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


const getters = {
    meiHeadersList: ['headerMetadata'],
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
