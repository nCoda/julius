// -*- coding: utf-8 -*-
//-------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/nuclear/stores/generics.js
// Purpose:                NuclearJS Stores for React components in the "generics" module.
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

import log from '../../util/log';
import signals from '../signals';


function dialogueBoxShow(previous, next) {
    // Verify the types of all the properties, then update the DialogueBox state.
    // NOTE: that this function prints errors and warnings directly to the Console. If not, we might
    //       end up in a circular update, since the "log" object may produce a DialogueBox.
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


function dialogueBoxHide() {
    // The default is hidden. This also eliminates the possibility that we let data carry over from
    // ond dialogue box to the next.
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
