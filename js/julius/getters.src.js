// NuclearJS Getters for Julius, the nCoda user interface.
//
// File Name: js/julius/getters.src.js
// Purpose: NuclearJS Getters for Julius.
//
// Copyright 2015 Christopher Antila
//


function stdioConcatter(output) {
    // Concatenates a List of strings into a single string.
    //
    return output.join('\n');
};


export default {
    meiHeadersList: ['headerMetadata'],
    hgChangesetHistory: ['hgChangesetHistory'],
    listOfInstruments: ['instruments'],
    stdin: [['stdin'], stdioConcatter],
    stdout: [['stdout'], stdioConcatter],
    stderr: [['stderr'], stdioConcatter],
    meiForVerovio: ['meiForVerovio'],
    sectionContextMenu: ['sectionContextMenu'],
};

export {stdioConcatter};
