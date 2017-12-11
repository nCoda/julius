// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/stores/index.js
// Purpose:                Initialize the Redux stores for Julius.
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

import { applyMiddleware, combineReducers, createStore, compose } from 'redux';
import createLogger from 'redux-logger';

import { reducer as documentStore } from './document';
import fujian from './fujian';
import lilypond from './lilypond';
import { getters as metaGetters, LOG_LEVELS, reducer as meta } from './meta';
import python from './python';
import textEditors from './text_editors';
import ui from './ui';
import verovio from './verovio';


const REDUCERS_OBJECT = {
    document: documentStore,
    fujian,
    lilypond,
    meta,
    python,
    ui,
    verovio,
    text_editors: textEditors,
};

const logger = createLogger({
    stateTransformer: (state) => {
        const newState = {};

        Object.keys(state).forEach((key) => {
            newState[key] = state[key].toJS();
        });

        return newState;
    },

    predicate: getState => metaGetters.logLevel(getState()) === LOG_LEVELS.DEBUG,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
    combineReducers(REDUCERS_OBJECT),
    composeEnhancers(
        applyMiddleware(logger),
    ),
);

export default store;
