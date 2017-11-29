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

import { Fujian } from '../util/fujian';
import { store } from './index';
import { getters as docGetters } from './document';


const CONNECTION = new Fujian();


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
    FUJIAN_RESTART_WS: 'Restart WebSocket connection to Fujian.',
    FUJIAN_START_WS: 'Start WebSocket connection to Fujian.',
    FUJIAN_STOP_WS: 'Stop WebSocket connection to Fujian.',
    GET_SECTION_BY_ID: 'fujian.GET_SECTION_BY_ID',
    REGISTER_OUTBOUND_FORMAT: 'fujian.REGISTER_OUTBOUND_FORMAT',
    RENDER_LILYPOND_PDF: 'fujian.RENDER_LILYPOND_PDF',
    SAVE_TEXT_EDITOR: 'fujian.SAVE_TEXT_EDITOR',
    SET_REPO_DIR: 'fujian.SET_REPO_DIR',
    SUBMIT_LILYPOND: 'fujian.SUBMIT_LILYPOND',
    SUBMIT_PYTHON: 'fujian.SUBMIT_PYTHON',
    UNREGISTER_OUTBOUND_FORMAT: 'fujian.UNREGISTER_OUTBOUND_FORMAT',
};


export const actions = {
    fujianStartWS() {
        store.dispatch({ type: types.FUJIAN_START_WS });
    },

    fujianRestartWS() {
        store.dispatch({ type: types.FUJIAN_RESTART_WS });
    },

    fujianStopWS() {
        store.dispatch({ type: types.FUJIAN_STOP_WS });
    },

    getSectionByID(viewsInfo, revision) {
        if (typeof viewsInfo === 'string') {
            const payload = { viewsInfo };
            if (typeof reivision === 'string') {
                payload.revision = revision;
            }

            store.dispatch({
                type: types.GET_SECTION_BY_ID,
                payload,
            });
        }
    },

    loadDefaultRepo() {
        store.dispatch({
            type: types.SET_REPO_DIR,
            payload: { repoDir: 'programs/hgdemo', runOutbound: true },
        });
    },

    loadSandboxRepo() {
        store.dispatch({
            type: types.SET_REPO_DIR,
            payload: { repoDir: '', runOutbound: true },
        });
    },

    registerOutboundFormat(dtype, who, runNow = false) {
        if (typeof dtype === 'string' && typeof who === 'string' && typeof runNow === 'boolean') {
            store.dispatch({
                type: types.REGISTER_OUTBOUND_FORMAT,
                payload: { dtype, runNow, who },
            });
        }
    },

    renderLilyPondPDF() {
        const sectID = docGetters.cursor(store.getState()).last();
        store.dispatch({
            type: types.RENDER_LILYPOND_PDF,
            payload: { sectID },
        });
    },

    /** Save the contents of the text editor without passing them through Lychee.
     *
     * @param {string} key - By which this text editor window identifies itself.
     * @param {string} value - The editor contents.
     */
    saveTextEditor(key, value) {
        if (typeof key !== 'string' || typeof value !== 'string') {
            return;
        } else if (!key || !value) {
            return;
        }

        const sectID = docGetters.cursor(store.getState()).last();

        store.dispatch({
            type: types.SAVE_TEXT_EDITOR,
            payload: { key, sectID, value },
        });
    },

    setRepoDir(repoDir, runOutbound = true) {
        if (typeof repoDir === 'string' && typeof runOutbound === 'boolean') {
            store.dispatch({
                type: types.SET_REPO_DIR,
                payload: { repoDir, runOutbound },
            });
        }
    },

    submitLilyPond(doc, sectID) {
        if (typeof doc === 'string') {
            const submitSectionID = typeof sectID === 'string'
                ? sectID
                : ''
                ;
            store.dispatch({
                type: types.SUBMIT_LILYPOND,
                payload: { doc, sectID: submitSectionID },
            });
        }
    },

    submitPython(code) {
        if (typeof code === 'string') {
            store.dispatch({
                type: types.SUBMIT_PYTHON,
                payload: code,
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

    case types.FUJIAN_START_WS:
        CONNECTION.startWS();
        break;

    case types.FUJIAN_RESTART_WS:
        CONNECTION.stopWS();
        CONNECTION.startWS();
        break;

    case types.FUJIAN_STOP_WS:
        CONNECTION.stopWS();
        break;

    case types.GET_SECTION_BY_ID:
    case types.REGISTER_OUTBOUND_FORMAT:
    case types.RENDER_LILYPOND_PDF:
    case types.SAVE_TEXT_EDITOR:
    case types.SET_REPO_DIR:
    case types.SUBMIT_LILYPOND:
    case types.UNREGISTER_OUTBOUND_FORMAT:
        CONNECTION.sendWS(JSON.stringify(action));
        break;

    case types.SUBMIT_PYTHON:
        CONNECTION.sendAjax(action.payload);
        break;

    case 'RESET':
        // TODO
        break;

    default:
        break;
    }

    return state;
}
