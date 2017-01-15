// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/util/log.js
// Purpose:                Application logging facilities for Julius.
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

/* eslint no-console: 0 */

import { store } from '../stores';
import { getters as metaGetters, LOG_LEVELS as LEVELS } from '../stores/meta';
import { actions as uiActions } from '../stores/ui';


// Set the log level with Redux.
let level = LEVELS.WARN;
function levelSetter() {
    const newLevel = metaGetters.logLevel(store.getState());
    if (newLevel !== level) {
        level = newLevel;
    }
}
store.subscribe(levelSetter);


// actual logging functions
export const log = {
    error(msg) {
        if (console.error) {
            console.error(msg);
            uiActions.showModal('error', 'Log Message', msg);
        }
    },

    warn(msg) {
        if (console.warn && level >= LEVELS.WARN) {
            console.warn(msg);
            uiActions.showModal('warn', 'Log Message', msg);
        }
    },

    info(msg) {
        if (console.info && level >= LEVELS.INFO) {
            console.info(msg);
        }
    },

    debug(msg) {
        if (console.log && level >= LEVELS.DEBUG) {
            console.log(msg);
        }
    },

    LEVELS: LEVELS,
};


export default log;
