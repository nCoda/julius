// -*- coding: utf-8 -*-
//-------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/nuclear/getters.js
// Purpose:                NuclearJS getters.
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


function stdioConcatter(output) {
    // Concatenates a List of strings into a single string.
    //
    return output.join('\n');
};


const getters = {
    meiHeadersList: ['headerMetadata'],
    hgChangesetHistory: ['hgChangesetHistory'],
    listOfInstruments: ['instruments'],
    stdin: [['stdin'], stdioConcatter],
    stdout: [['stdout'], stdioConcatter],
    stderr: [['stderr'], stdioConcatter],
    meiForVerovio: ['meiForVerovio'],
    sectionContextMenu: ['sectionContextMenu'],
    logLevel: ['logLevel'],
};

export {getters, stdioConcatter};
export default getters;
