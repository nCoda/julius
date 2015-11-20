// -*- coding: utf-8 -*-
//-------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/julius/stores/mercurial.js
// Purpose:                NuclearJS Stores related to Mercurial.
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


import {Store, toImmutable} from 'nuclear-js';
import signals from '../signals';


var ChangesetHistory = Store({
    // Representing a history of Mercurial changesets.
    //
    // Exactly what the contained changesets represent is not determined here. This may correspond
    // to the entire repository's history, to the changesets in a particular branch, or a user's
    // three most recent changesets, even if they're unrelated.
    //
    // The data are stored as an ImmutableJS.List of ImmutableJS.Map with this shape. All members
    // are strings unless otherwise noted.
    //
    // - changeset: The changeset's identifying hash (e.g., "f9781620bc18")
    //
    // - tag: The changeset's identifying tag (e.g., "tip")
    //
    // - name: The user who made the commit (e.g., "Christopher Antila")
    //
    // - email: Email address of the user who made the commit (e.g., "christopher@ncodamusic.org")
    //
    // - username: nCoda username of the user (e.g., "crantila")
    //
    // - date: That date, time, and UTC offset of the revision, in this format:
    //    YYYY-MM-DD HH:MM:SS dOOOO
    //   For example:
    //    2015-11-2 21:20:57 -0500
    //
    // - summary: Textual description of the changset, provided by the user.
    //
    // - parents (list of str): Identifying hashes of the parent changesets.
    //
    // - children (list of str): Idenityfing hashes of the children changesets.
    //
    // - files (list of str): Pathnames that were modified in the changeset.
    //
    // - diffAdded (int): The number of lines added in this changeset.
    //
    // - diffRemoved (int): The number of lines removed in this changeset.
    //

    getInitialState() {
        return toImmutable([]);
    },
    initialize() {
        this.on(signals.names.HG_ADD_CHANGESET, addChangeset);
    }
});


function addChangeset(previousState, payload) {
    // Make a new changeset and put it in the ChangesetHistory store.
    //
    // Payload: An object that may have any of the fields defined for a ChangesetHistory object.
    //     Other fields are ignored.
    //

    let cset = {
        changeset:   payload.changeset   || '',
        tag:         payload.tag         || '',
        name:        payload.name        || '',
        email:       payload.email       || '',
        username:    payload.username    || '',
        date:        payload.date        || '',
        summary:     payload.summary     || '',
        parents:     payload.parents     || [],
        children:    payload.children    || [],
        files:       payload.files       || [],
        diffAdded:   payload.diffAdded   || 0,
        diffRemoved: payload.diffRemoved || 0
    };

    return previousState.push(toImmutable(cset));
};


export default {
    ChangesetHistory: ChangesetHistory
};
