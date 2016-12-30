// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/stores/ui.js
// Purpose:                Store for state related to the User Interface.
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


/**
 * Root Store
 * ----------
 * @param {ImmutableMap} modal - Information about a modal window being displayed. See below.
 *
 * Modal Map
 * ---------
 * For the "modal" field above.
 * @param {boolean} displayed - Whether the modal window currently is being (or should be) shown.
 * @param {string} type - One of: debug, error, info, question, warn.
 * @param {string} message - Primary message; one short sentence.
 * @param {string} detail - Optional elaboration.
 * @param {function} callback - Optional callback function.
 */


export const types = {
    SHOW_MODAL: 'a modal window is shown',
    HIDE_MODAL: 'a modal window is hidden',
};


export const actions = {
    /** showModal() - Show a modal window with the provided settings.
     *
     * @param {string} type - One of: debug, error, info, question, warn.
     * @param {string} message - Primary message; one short sentence.
     * @param {string} detail - Optional elaboration.
     * @param {function} callback - Optional callback function. If the "type" is "question" then
     *     this is called with the user's input; otherwise with no arguments.
     */
    showModal(type, message, detail, callback) {
        store.dispatch({type: types.SHOW_MODAL, payload: {type, message, detail, callback}});
    },

    hideModal() {
        store.dispatch({type: types.HIDE_MODAL});
    },
};


export const getters = {
    modalDisplayed(state) {
        return state.ui.getIn(['modal', 'displayed']);
    },

    modalType(state) {
        return state.ui.getIn(['modal', 'type']);
    },

    modalMessage(state) {
        return state.ui.getIn(['modal', 'message']);
    },

    modalDetail(state) {
        return state.ui.getIn(['modal', 'detail']);
    },

    modalCallback(state) {
        return state.ui.getIn(['modal', 'callback']);
    },
};


export function makeInitialState() {
    return Immutable.Map({
        modal: makeEmptyModal(),
    });
}


export function makeEmptyModal() {
    return Immutable.Map({
        displayed: false,
        type: 'info',
        message: '',
        detail: '',
        callback: () => {},
    });
}


export const verifiers = {
    modal(settings) {
        const post = makeEmptyModal().toJS();
        post.displayed = true;

        const fieldNames = [
            ['message', 'string'],
            ['detail', 'string'],
            ['callback', 'function'],
        ];

        for (const field of fieldNames) {
            if (settings[field[0]] && typeof settings[field[0]] === field[1]) {
                post[field[0]] = settings[field[0]];
            }
        }

        if (['debug', 'error', 'info', 'question', 'warn'].includes(settings.type)) {
            post.type = settings.type;
        }

        return Immutable.Map(post);
    },
};


export default function reducer(state = makeInitialState(), action) {
    switch (action.type) {
        case types.SHOW_MODAL:
            return state.set('modal', verifiers.modal(action.payload));

        case types.HIDE_MODAL:
            return state.set('modal', makeEmptyModal());

        case 'RESET':
            return makeInitialState();
    }

    return state;
}
