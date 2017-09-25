// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/stores/text_editors.js
// Purpose:                Redux store for the text editors of the current project in nCoda.
//
// Copyright (C) 2017 Sienna M. Wood
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

import { store } from './index';

export const types = {
    SET_EDITOR_CONTENT: 'set editor content',
};


export const actions = {
    setEditorContent(editorName, content) {
        if (typeof editorName === 'string' && typeof content === 'string') {
            store.dispatch({
                type: types.SET_EDITOR_CONTENT,
                editorName,
                content,
            });
        }
    },
};

export const getters = {
    current(state, editorName) {
        return state.text_editors.getIn([editorName]);
    },
};

export function makeInitialState() {
    const editorNames = ['python', 'lilypond'];
    const editors = editorNames.reduce((obj, editor) => {
        obj[editor] = '';
        return obj;
    }, {});
    return Immutable.Map(editors);
}

export default function reducer(state = makeInitialState(), action) {
    switch (action.type) {
    case types.SET_EDITOR_CONTENT:
        if (action.error !== true) {
            return state.setIn([action.editorName], action.content);
        }
        break;
    case 'RESET':
        return makeInitialState();
    }

    return state;
}
