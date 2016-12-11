// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/nuclear/init.js
// Purpose:                Initialize the NuclearJS Stores for Julius.
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

// NOTE: You must import this module as early as possible during application startup!
// NOTE: You must also import this module for any tests that use NuclearJS.

import document from './stores/document';
import lilypond from './stores/lilypond';
import mercurial from './stores/mercurial';
import reactor from './reactor';
import revisions from './stores/revisions';
import stdio from './stores/stdio';
import verovio from './stores/verovio';
import {generics} from './stores/generics';


reactor.registerStores({
    headers: document.Headers,
    revlog: mercurial.Revlog,
    sections: document.Sections,
    sectionCursor: document.Cursor,
    stdin: stdio.Stdin,
    stdout: stdio.Stdout,
    stderr: stdio.Stderr,  // NOTE: don't use stderr (for now?) because it isn't shown in CodeScoreView
    meiForVerovio: verovio.MeiForVerovio,
    DialogueBox: generics.DialogueBox,
    revisions: revisions.Revisions,
    lilypond: lilypond.Sections,
});


const init = 'init';
export {init};
export default init;
