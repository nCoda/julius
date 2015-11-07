// NuclearJS Store for Julius, the nCoda user interface.
//
// File Name: js/julius/stores/headerMetadata.src.js
// Purpose: NuclearJS stores for Mercurial VCS information in Julius.
//
// Copyright 2015 Christopher Antila
//

import {Store, toImmutable} from 'nuclear-js';
import signals from '../signals.src';


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
