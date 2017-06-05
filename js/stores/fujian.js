// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/stores/fujian.js
// Purpose:                Store with actions that emit a signal to Lychee via Fujian.
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

import { fujian } from '../util/fujian';
import { store } from './index';

/** Fujian Store
 *  ------------
 *
 * The actions in this store send messages to Lychee via Fujian. While we could simply retain
 * a series of functions that call the util.fujian module, using Redux actions allows us to track
 * these actions in the same way as other Redux actions, while also allowing other stores to
 * observe and react to future expected changes.
 *
 * This store has no data structure. The reducer always returns null.
 */

export const types = {
    REGISTER_OUTBOUND_FORMAT: 'fujian.REGISTER_OUTBOUND_FORMAT',
    UNREGISTER_OUTBOUND_FORMAT: 'fujian.UNREGISTER_OUTBOUND_FORMAT',
};


export const actions = {
    registerOutboundFormat(dtype, who, runNow) {
        if (typeof dtype === 'string' && typeof who === 'string' && typeof runNow === 'boolean') {
            store.dispatch({
                type: types.REGISTER_OUTBOUND_FORMAT,
                payload: { dtype, runNow, who },
            });
        }
    },

    unregisterOutboundFormat(dtype, who) {
        if (typeof dtype === 'string' && typeof who === 'string') {
            store.dispatch({
                type: types.UNREGISTER_OUTBOUND_FORMAT,
                payload: { dtype, who },
            });
        }
    },
};


export default function reducer(state = Immutable.Map(), action) {
    switch (action.type) {

    case types.REGISTER_OUTBOUND_FORMAT:
    case types.UNREGISTER_OUTBOUND_FORMAT:
        fujian.sendWS(JSON.stringify(action));
        break;

    case 'RESET':
        // TODO
        break;

    default:
        break;
    }

    return state;
}
