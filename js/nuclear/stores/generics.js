// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/nuclear/stores/generics.js
// Purpose:                NuclearJS Stores for React components in the "generics" module.
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

import log from '../../util/log';
import signals from '../signals';


/** Verify properties then update the DialogueBox Store.
 * @param {ImmutableJS.Map} previous - The DialogueBox Store's previous state.
 * @param {Object} next - An Object with new attributes for the Store.
 * @returns {ImmutableJS.Map} The Store's new state.
 *
 * Note: this function prints errors and warnings directly to the Console. If this weren't the case,
 *       we might end up in a circular update, since "log" produces a DialogueBox on errors.
 */
function dialogueBoxShow(previous, next) {
    let post = generics.DialogueBox.getInitialState();
    post = post.set('displayed', true);

    if ('string' === typeof next.type) {
        post = post.set('type', next.type);
    }

    if ('string' === typeof next.message) {
        post = post.set('message', next.message);
    }
    else {
        log.warning('We will produce a DialogueBox without a "message"!');
    }

    if ('string' === typeof next.detail) {
        post = post.set('detail', next.detail);
    }

    if ('function' === typeof next.callback) {
        post = post.set('callback', next.callback);
    }

    return post;
}


/** Reset the DialogueBox Store to its original state, hiding it.
 * @returns {ImmutableJS.Map} The Store's initial state.
 */
function dialogueBoxHide() {
    return generics.DialogueBox.getInitialState();
}


const generics = {
    DialogueBox: Store({
        // Representing the DialogueBox React component.
        //

        getInitialState() {
            return toImmutable({
                displayed: false,
                type: 'debug',
                message: 'Message',
                detail: undefined,
                callback: undefined,
            });
        },
        initialize() {
            this.on(signals.names.DIALOGUEBOX_SHOW, dialogueBoxShow);
            this.on(signals.names.DIALOGUEBOX_HIDE, dialogueBoxHide);
        },
    }),
};


export default generics;
export {generics};
