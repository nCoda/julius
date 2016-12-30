// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/stores/meta.js
// Purpose:                A meta store for assorted things that don't fit in other stores.
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

import { store } from './index';


/**
 * Root Store
 * ----------
 * @param {string} log_level - One of those defined just below
 * @param {ImmutableMap} stdio - With three fields (stdin, stdout, stderr) representing the content
 *     of those input/output streams.
 */

export const LOG_LEVELS = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3,
};


export const types = {
    SET_LOG_LEVEL: 'set the log level',
    WRITE_STDIN: 'write to stdin',
    WRITE_STDOUT: 'write to stdout',
    WRITE_STDERR: 'write to stderr',
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

    /** writeToStdio() - Add content to a stdio stream.
     *
     * @param {str} stream - One of: stdin, stdout, stderr.
     * @param {str} content - The string to add to the stream. Note that a newline character is
     *     *always* appended after "content."
     */
    writeToStdio(stream, content) {
        if (content && typeof content === 'string') {
            content = `${content}\n`;
            switch (stream) {
                case 'stdin':
                    store.dispatch({type: types.WRITE_STDIN, payload: content});
                    break;
                case 'stdout':
                    store.dispatch({type: types.WRITE_STDOUT, payload: content});
                    break;
                case 'stderr':
                    store.dispatch({type: types.WRITE_STDERR, payload: content});
                    break;
            }
        }
    },
};


/** tryToMakeSafe() - Try to make "thisString" safe to be used with dangerouslySetInnerHTML.
 *
 * @param {string} thisString - The stdio string to clean.
 * @returns {string} thatString - The cleaned string.
 *
 * Currently this function does two things:
 * 1.) Replace < and > with &lt; and &gt;, respectively.
 * 2.) Replace newline characters with <br>.
 */
function tryToMakeSafe(thisString) {
    return thisString.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
}


export const getters = {
    logLevel(state) {
        return state.meta.get('log_level');
    },

    stdin(state) {
        return tryToMakeSafe(state.meta.getIn(['stdio', 'stdin']));
    },
    stdout(state) {
        return tryToMakeSafe(state.meta.getIn(['stdio', 'stdout']));
    },
    stderr(state) {
        return tryToMakeSafe(state.meta.getIn(['stdio', 'stderr']));
    },

    stdinUnsafe(state) {
        return state.meta.getIn(['stdio', 'stdin']);
    },
    stdoutUnsafe(state) {
        return state.meta.getIn(['stdio', 'stdout']);
    },
    stderrUnsafe(state) {
        return state.meta.getIn(['stdio', 'stderr']);
    },
};


export function makeInitialState() {
    return Immutable.Map({
        log_level: LOG_LEVELS.WARN,
        stdio: Immutable.Map({stdin: '', stdout: '', stderr: ''}),
    });
}


export function reducer(state = makeInitialState(), action) {
    switch (action.type) {
        case types.SET_LOG_LEVEL:
            return state.set('log_level', action.payload);

        case types.WRITE_STDIN:
            return state.setIn(
                ['stdio', 'stdin'],
                state.getIn(['stdio', 'stdin']) + action.payload,
            );

        case types.WRITE_STDOUT:
            return state.setIn(
                ['stdio', 'stdout'],
                state.getIn(['stdio', 'stdout']) + action.payload,
            );

        case types.WRITE_STDERR:
            return state.setIn(
                ['stdio', 'stderr'],
                state.getIn(['stdio', 'stderr']) + action.payload,
            );

        case 'RESET':
            return makeInitialState();
    }

    return state;
}


export default reducer;
