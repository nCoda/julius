// -*- coding: utf-8 -*-
//-------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/nuclear/stores/mercurial.js
// Purpose:                NuclearJS Stores related to Mercurial.
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
import signals from '../signals';
import {log} from '../../util/log';


const mercurial = {
    /** Revlog - a Mercurial revlog.
     *
     * The data format ere is just what's provided to us by Lychee's "vcs_outbound" converter.
     */
    Revlog: Store({
        getInitialState() {
            return toImmutable([]);
        },
        initialize() {
            this.on(signals.names.VCS_NEW_REVLOG, vcsNewRevlog);
        },
    }),
};


/** Entirely replace the contents of the existing revlog with a new one.
 *
 * @param {ImmutableJS.Map} previous - The previous Revlog data. Returned if the new data are invalid.
 * @param {string} next - Lychee's data output from the "converters.vcs_outbound" module.
 *
 * @returns {ImmutableJS.Map} - Lychee's data converted to a Map.
 */
function vcsNewRevlog(previous, next) {
    let post;
    try {
        post = JSON.parse(next);
    }
    catch (exc) {
        if ('SyntaxError' === exc.name) {
            log.warn("Could not parse Lychee's VCS data into JSON. VCS data will be out-of-date.");
            return previous;
        }
        else {
            throw exc;
        }
    }

    return toImmutable(post);
}


export default mercurial;
export {mercurial};
