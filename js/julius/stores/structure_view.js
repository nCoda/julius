// NuclearJS Store for Julius, the nCoda user interface.
//
// File Name: js/julius/stores/structure_view.src.js
// Purpose: NuclearJS stores for StructureView GUI-related information.
//
// Copyright 2015 Christopher Antila
//

import {Store, toImmutable} from 'nuclear-js';
import signals from '../signals.src';


function verifyIsPixels(spec) {
    // Guarantees that "spec" is a string with a number followed by "px".
    //

    if ('string' === typeof spec) {
        if (spec.endsWith('px')) {
            if (spec.length > 2) {
                if (!Number.isNaN(Number(spec.slice(0, -2)))) {
                    return true;
    }}}}

    return false;
}


function sectionContextMenu(previousState, payload) {
    // Verify that the properties are all valid, then return the new settings.
    //
    // Payload:
    // An object with "left", "top", and "show" members. The first two correspond to the desired CSS
    // attributes of the same name for the context menu, and must be a string with a number followed
    // by "px". The "show" member is a boolean indicating whether to show the menu.
    //
    // If "show" is false, "left" and "top" are ignored and their presence is not checked. If "show"
    // is true, "left" and "top" must both be present.
    //

    if (undefined !== payload.show) {
        if (true === payload.show) {
            if (verifyIsPixels(payload.left) && verifyIsPixels(payload.top)) {
                return toImmutable({
                    display: 'flex',
                    left: payload.left,
                    top: payload.top
                });
            } else {
                console.error('SECTION_CONTEXT_MENU signal received improper "left" and "top" arguments.');
            }
        } else if (false === payload.show) {
            return toImmutable({display: 'none'});
        } else {
            console.error('SECTION_CONTEXT_MENU signal must have true or false "show" argument');
            return previousState;
        }
    } else {
        console.error('SECTION_CONTEXT_MENU signal requires "show" argument');
        return previousState;
    }
}


export default {
    SectionContextMenu: Store({
        //
        getInitialState() {
            return toImmutable({display: 'none', top: '0px', left: '0px'});
        },
        initialize() {
            this.on(signals.names.SECTION_CONTEXT_MENU, sectionContextMenu);
        }
    }),
};
