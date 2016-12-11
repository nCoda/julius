// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/stores/meta.js
// Purpose:                A meta store for assorted things that don't fit in other stores.
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

import Immutable from 'immutable';

import { store } from './index';


/**
 * Root Store
 * ----------
 * @param {string} log_level - One of those defined just below
 */

export const LOG_LEVELS = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3,
};


export const types = {
    SET_LOG_LEVEL: 'set the log level',
};


export const actions = {
    setLogLevel(level) {
        if (LOG_LEVELS.ERROR === level ||
            LOG_LEVELS.WARN === level ||
            LOG_LEVELS.INFO === level ||
            LOG_LEVELS.DEBUG === level) {
            store.dispatch({type: types.SET_LOG_LEVEL, payload: level});
        }
    },
};


export const getters = {
    logLevel(state) {
        return state.meta.get('log_level');
    },
};


export function makeInitialState() {
    return Immutable.Map({
        log_level: LOG_LEVELS.WARN,
    });
}


export function reducer(state = makeInitialState(), action) {
    switch (action.type) {
        case types.SET_LOG_LEVEL:
            return state.set('log_level', action.payload);
    }

    return state;
}


export default reducer;
