// -*- coding: utf-8 -*-
//-------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/tests/test_generics.js
// Purpose:                Tests for the "generics" React components.
//
// Copyright (C) 2016 Christopher Antila, Sienna M. Wood
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

import {init} from '../../nuclear/init';
import nuclear from 'nuclear-js';

import reactor from '../../nuclear/reactor';
import signals from '../../nuclear/signals';
import getters from '../../nuclear/getters';

import React from 'react';
import {mount, shallow} from 'enzyme';

jest.dontMock('../generics');
const generics = require('../generics');


describe('DialogueBox', () => {
    beforeEach(() => { reactor.reset(); });

    it('works properly when not displayed', () => {
        signals.emitters.dialogueBoxHide();
        const dialogueBox = shallow(<generics.DialogueBox/>).node;
        expect(dialogueBox.ref).toBe('dialogueBoxHidden');
        expect(dialogueBox.type).toBe('div');
        expect(dialogueBox.props.style.display).toBe('none');
    });

    /** Run a test on the DialogueBox component
     *
     * @param {object} props - Object with type, message, detail, callback.
     * @param {string} answer - The text to write into the <SimpleInput> element (only for "question" type).
     * @returns {undefined}
     */
    function dialogueBoxTester(props, answer) {
        signals.emitters.dialogueBoxShow(props);

        // check that nuclear is calling this object correctly
        expect(reactor.evaluate(getters.DialogueBox).get('displayed')).toBe(true);
        expect(reactor.evaluate(getters.DialogueBox).get('type')).toEqual(props.type);
        expect(reactor.evaluate(getters.DialogueBox).get('message')).toEqual(props.message);
        expect(reactor.evaluate(getters.DialogueBox).get('detail')).toEqual(props.detail);

        // shallow render and check structure
        const dialogueBoxWrapper = shallow(<generics.DialogueBox/>);
        const dialogueBox = dialogueBoxWrapper.node;

        expect(dialogueBox.type.displayName).toBe('Modal');
        const h1 = dialogueBoxWrapper.find('h1');
        expect(h1.node.props.children).toBe(props.message);
        const paragraph = dialogueBoxWrapper.find('p');
        expect(paragraph.node.props.children).toBe(props.detail);

        if (props.type === 'question') {
            const simpleInput = dialogueBoxWrapper.find('SimpleInput');
            expect(simpleInput.node.ref).toBe('dialogueBoxInput');
        } else {
            const div = dialogueBoxWrapper.find('div');
            expect(div.node.ref).toBe('dialogueBoxHidden');
            expect(div.node.props.style.display).toBe('none');
        }

        // mount to simulate click and check callback function
        const dialogueBoxMount = mount(<generics.DialogueBox />);

        //put text in input if question type
        if(props.type == 'question') {
            dialogueBoxMount.node.handleInputChange(answer);
        }

        // simulate click
        dialogueBoxMount.find('Modal').node.props.onRequestClose();

        // check that the callback was called correctly and the DialogueBox was hidden
        if (props.type === 'question') {
            expect(props.callback).toBeCalledWith(answer);
        } else {
            expect(props.callback).toBeCalledWith();
        }
        expect(reactor.evaluate(getters.DialogueBox).get('displayed')).toBe(false);
    }

    it('works with "error"', () => {
        const props = {type: 'error', message: 'A', detail: 'B', callback: jest.genMockFn()};
        dialogueBoxTester(props);
    });

    it('works with "warn"', () => {
        const props = {type: 'warn', message: 'A', detail: 'B', callback: jest.genMockFn()};
        dialogueBoxTester(props);
    });

    it('works with "info"', () => {
        const props = {type: 'info', message: 'A', detail: 'B', callback: jest.genMockFn()};
        dialogueBoxTester(props);
    });

    it('works with "debug"', () => {
        const props = {type: 'debug', message: 'A', detail: 'B', callback: jest.genMockFn()};
        dialogueBoxTester(props);
    });

    it('works with "question"', () => {
        const props = {type: 'question', message: 'A', detail: 'B', callback: jest.genMockFn()};
        const answer = '42';
        dialogueBoxTester(props, answer);
    });
});
