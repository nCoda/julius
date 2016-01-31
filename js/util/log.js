// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/util/log.js
// Purpose:                Application logging facilities for Julius.
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
// ------------------------------------------------------------------------------------------------

/* eslint no-console: 0 */


import {getters} from '../nuclear/getters';
import {reactor} from '../nuclear/reactor';


const LEVELS = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3,
};


// set the log level with NuclearJS
// just in case Nuclear isn't working, we default to WARN
let level = LEVELS.WARN;
/** Set the log level.
 * @param {int} newLevel - A member of "LEVELS" indicating the new log level.
 * @returns {undefined}
 */
function levelSetter(newLevel) {
    level = newLevel;
}
reactor.observe(getters.logLevel, levelSetter);


// determine which Console functions are available
let haveError = false;
let haveWarn = false;
let haveInfo = false;
let haveLog = false;

if (console) {
    if (console.error) {
        haveError = true;
    }
    if (console.warn) {
        haveWarn = true;
    }
    if (console.info) {
        haveInfo = true;
    }
    if (console.debug) {
        haveLog = true;
    }
}


// actual logging functions
const log = {
    error(msg) {
        if (haveError && level >= LEVELS.ERROR) {
            console.error(msg);
        }
    },

    warn(msg) {
        if (haveWarn && level >= LEVELS.WARN) {
            console.warn(msg);
        }
    },

    info(msg) {
        if (haveInfo && level >= LEVELS.INFO) {
            console.info(msg);
        }
    },

    debug(msg) {
        if (haveLog && level >= LEVELS.DEBUG) {
            console.log(msg);
        }
    },

    LEVELS: LEVELS,
};


export {log, LEVELS};
export default log;
