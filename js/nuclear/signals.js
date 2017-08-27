// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/nuclear/signals.js
// Purpose:                NuclearJS Actions and ActionTypes.
//
// Copyright (C) 2016, 2017 Christopher Antila
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

/*
NOTE: This file is deprecated so please do not add anything to it.

This file is the last remaining program code from when Julius used NuclearJS instead of Redux.
These "signal" functions will be gradually migrated to Redux "action" functions, but they remain
here for two reasons:

   1.) These functions are designed for, but do not use, NuclearJS itself. Therefore these functions
       are self-contained and do not force us to retain any other legacy baggage.
   2.) These functions are part of the interaction between Julius and Fujian, which we intend to
       change significantly in the near future. Keeping these functions separate from the rest of
       our Redux "action" functions helps to signify the impermanent nature of this module.
*/


import { log } from '../util/log';
import { fujian } from '../util/fujian';

import store from '../stores';
import { getters as docGetters } from '../stores/document';


// "emitters" is NuclearJS "actions."
const emitters = {
    submitToLychee(data, format, inboundOnly = false) {
        // Given some "data" and a "format," send the data to Lychee via Fujian as an update to the
        // currently-active score/section.
        //
        // Parameters:
        // - data (string) Data to submit to Lychee.
        // - format (string) The string "lilypond".
        //

        if (typeof data !== 'string') {
            log.error('submitToLychee() received a "data" argument that is not a string.');
            return;
        }

        const lowercaseFormat = (format || '') && format.toLowerCase();

        if (lowercaseFormat === 'lilypond') {
            // First check there is no """ in the string, which would cause the string to terminate
            // early and allow executing arbitrary code.
            if (data.indexOf('"""') >= 0) {
                log.error('Invalid LilyPond code. Please do not use """ in your LilyPond code.');
            } else {
                // find the @xml:id
                let xmlid = docGetters.cursor(store.getState()).last();
                if (xmlid) {
                    xmlid = `"${xmlid}"`;
                } else {
                    xmlid = 'None';
                }
                // make sure all the "\" chars are escaped
                const cleanedData = data.replace(/\\/g, '\\\\');
                // put the Python command around it
                let code;
                if (inboundOnly) {
                    code = `session.run_inbound(dtype='LilyPond', doc="""${cleanedData}""", sect_id=${xmlid})`;
                } else {
                    code = `session.run_workflow(dtype='LilyPond', doc="""${cleanedData}""", sect_id=${xmlid})`;
                }
                fujian.sendWS(code);
            }
        } else if (lowercaseFormat === 'mei') {
            log.info('submitToLychee() was called with MEI data, but that\'s not implemented yet!');
        } else {
            log.error('submitToLychee() received an unknown "format" argument.');
        }
    },
    submitToPyPy(code) {
        // For code being submitted by the human user.
        //
        fujian.sendAjax(code);
    },

    doLilyPondPDF() {
        const sectID = docGetters.cursor(store.getState()).last();
        const code = `{"type":"lilypond_pdf","payload":"${sectID}"}`;
        fujian.sendWS(code);
    },
};


const signals = {emitters};
export {signals, emitters};
export default signals;
