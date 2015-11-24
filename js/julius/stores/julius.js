// -*- coding: utf-8 -*-
//-------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/julius/stores/julius.js
// Purpose:                Julius-specific Stores, like for logging.
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
import {log, LEVELS} from '../log';
import {signals} from '../signals';


const setters = {
    setLogLevel(previous, next) {
        if (LEVELS.ERROR === next ||
            LEVELS.WARN  === next ||
            LEVELS.INFO  === next ||
            LEVELS.DEBUG === next) {

            return next;
        }

        log.warn('setLogLevel() received an invalid log level');
        return previous;
    },
};


const stores = {
    LogLevel: Store({
        getInitialState() {
            return LEVELS.WARN;
        },
        initialize() {
            this.on(signals.names.SET_LOG_LEVEL, setters.setLogLevel);
        },
    }),
};


export {stores, setters};
