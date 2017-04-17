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

import Immutable from 'immutable';

import {log} from '../util/log';
import {fujian} from '../util/fujian';

import store from '../stores';
import { getters as docGetters } from '../stores/document';


// "emitters" is NuclearJS "actions."
const emitters = {
    // Fujian PyPy Server (currently doesn't affect NuclearJS)
    fujianStartWS() {
        fujian.startWS();
    },
    fujianRestartWS() {
        fujian.stopWS();
        fujian.startWS();
    },
    fujianStopWS() {
        fujian.stopWS();
    },
    /** lyGetSectionById(): Run the outbound steps to get MEI data for a specific section.
     *
     * Parameters:
     * -----------
     * @param {string} sectId - The @xml:id value of the <section> to request.
     * @param {string} revision - Optional changeset identifier if you wish to receive "historical"
     *     data from the document.
     */
    lyGetSectionById(sectId, revision) {
        if (revision) {
            fujian.sendWS(
                `session.run_outbound(views_info="${sectId}", revision="${revision}")\n`
            );
        } else if (sectId) {
            fujian.sendWS(
                `session.run_outbound(views_info="${sectId}")\n`
            );
        } else {
            log.info('lyGetSectionById() is missing "sectId" argument; nothing will happen');
        }
    },
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

        const lowercaseFormat = format && format.toLowerCase();

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

    // Registering outbound formats with Lychee
    _regOutboundFormat(direction, dtype, who, extra) {
        // You must call this through registerOutboundFormat() or unregisterOutboundFormat().
        // --> the "extra" param is just a string where you can put stuff for an extra argument to the signal
        //
        if ('string' !== typeof dtype) {
            const msg = `Calling ${direction}_FORMAT requires a string for "dtype".`;
            log.warn(msg);
            return;
        }

        if (!extra) {
            extra = '';
        }

        dtype = `'${dtype}'`;
        if ('string' === typeof who) {
            who = `'${who}'`;
        }
        else {
            who = 'None';
        }
        fujian.sendWS(`session.registrar.${direction}(dtype=${dtype}, who=${who})`);
    },
    /** Emit Lychee's "outbound.REGISTER_FORMAT" signal.
     *
     * @param {str} dtype - Which dtype to register for outbound conversion.
     * @param {str} who - An identifier for the component requiring the registration.
     * @param {bool} outbound - Whether to run the "outbound" conversion immediately, producing
     *     data in this format without requiring a change in the document.
     */
    registerOutboundFormat(dtype, who, outbound) {
        if (outbound) {
            emitters._regOutboundFormat('register', dtype, who, ', outbound=True');
        }
        else {
            emitters._regOutboundFormat('register', dtype, who);
        }
    },
    /** Emit Lychee's "outbound.UNREGISTER_FORMAT" signal.
     *
     * @param {str} dtype - Which dtype to unregister.
     * @param {str} who - The "who" argument provided on registration.
     */
    unregisterOutboundFormat(dtype, who) {
        emitters._regOutboundFormat('unregister', dtype, who);
    },

    /** Change the repository directory.
     *
     * @param {string} path - Pathname to use for the repository.
     *
     * This is equivalent to "opening" an existing project, or creating a new one. This does *not*
     * move an existing repository directory.
     */
    lySetRepoDir(path) {
        if (path.indexOf(';') > -1 || path.indexOf(')') > -1 || path.indexOf("'") > -1) {
            // TODO: blacklisting like this isn't sufficient
            log.error('The pathname is invalid');
        } else {
            let cleanedPath;
            if ((path[0] === "'" && path[path.length - 1] === "'") ||
                (path[0] === '"' && path[path.length - 1] === '"')
            ) {
                cleanedPath = path;
            } else {
                cleanedPath = `'${path}'`;
            }

            const code = `session.set_repo_dir(${cleanedPath}, run_outbound=True)`;
            fujian.sendWS(code);
        }
    },
    /** Load the default demo repository.'
     */
    lyLoadDefaultRepo() {
        emitters.lySetRepoDir('"programs/hgdemo"');
    },

    lyLoadSandboxRepo() {
        emitters.lySetRepoDir('""');
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
