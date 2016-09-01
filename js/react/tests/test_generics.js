// -*- coding: utf-8 -*-
//-------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/tests/test_generics.js
// Purpose:                Tests for the "generics" React components.
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
//-------------------------------------------------------------------------------------------------

import {init} from '../../nuclear/init';

import nuclear from 'nuclear-js';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import reactor from '../../nuclear/reactor';
import signals from '../../nuclear/signals';
import getters from '../../nuclear/getters';

jest.dontMock('../generics');
const generics = require('../generics');


describe('ModalBackground', () => {
    it('works as intended', () => {const children = 'this is the children';
        const backg = TestUtils.renderIntoDocument( <generics.ModalBackground children={children}/> );
        const backgNode = ReactDOM.findDOMNode(backg);

        expect(backgNode.tagName).toBe('DIV');
        expect(backgNode.className).toBe('nc-modal-background');
        expect(backgNode.innerHTML).toBe(children);
    });
});


describe('DialogueBox', () => {
    beforeEach(() => { reactor.reset(); });

    it('works properly when not displayed', () => {
        signals.emitters.dialogueBoxHide();
        const box = TestUtils.renderIntoDocument( <generics.DialogueBox/> );
        const boxNode = ReactDOM.findDOMNode(box);
        expect(boxNode.tagName).toBe('DIV');
        expect(boxNode.style.display).toBe('none');
    });

    /** Run a test on the DialogueBox component
     *
     * @param {object} props - Object with type, message, detail, callback.
     * @param {string} expIconClass - The expected className of the <i> icon; this string will have
     *        "fa fa-" prepended automatically, so you can omit that part.
     * @param {string} expTitle - The text expected in the "nc-dialogue-type" <div>.
     * @param {string} answer - The text to write into the <input> element (only for "question").
     * @returns {undefined}
     */
    function dialogueBoxTester(props, expIconClass, expTitle, answer) {
        signals.emitters.dialogueBoxShow(props);
        const box = TestUtils.renderIntoDocument( <generics.DialogueBox/> );
        const boxNode = ReactDOM.findDOMNode(box);

        // check that it rendered correctly
        expect(boxNode.tagName).toBe('DIV');
        expect(boxNode.className).toBe('nc-modal-background');
        expect(boxNode.children[0].tagName).toBe('DIV');
        expect(boxNode.children[0].className).toBe(`nc-dialogue-box nc-dialogue-${props.type}`);
        const titleDiv = boxNode.children[0].children[0];
        expect(titleDiv.tagName).toBe('DIV');
        expect(titleDiv.className).toBe('nc-dialogue-type');
        expect(titleDiv.children[0].tagName).toBe('I');
        expect(titleDiv.children[0].className).toBe(`fa fa-${expIconClass}`);
        expect(titleDiv.children[1].tagName).toBe('H3');
        expect(titleDiv.children[1].innerHTML).toBe(expTitle);
        const message = boxNode.children[0].children[1];
        expect(message.tagName).toBe('P');
        expect(message.className).toBe('nc-dialogue-msg');
        expect(message.innerHTML).toBe(props.message);
        const detail = boxNode.children[0].children[2];
        expect(detail.tagName).toBe('P');
        expect(detail.className).toBe('nc-dialogue-detail');
        expect(detail.innerHTML).toBe(props.detail);
        let button;
        if (answer) {
            // 3 is the <input> for "answer"
            button = boxNode.children[0].children[4];
        }
        else {
            button = boxNode.children[0].children[3];
        }
        expect(button.tagName).toBe('BUTTON');
        expect(button.className).toBe('btn');
        expect(button.innerHTML).toBe('OK');

        // write text in the <input> answer box
        if (props.type === 'question') {
            boxNode.children[0].children[3].value = answer;
        }

        // "click" the OK button
        TestUtils.Simulate.click(button);

        // check that the callback was called, and the DialogueBox hidden
        if (props.type === 'question') {
            expect(props.callback).toBeCalledWith(answer);
        } else {
            expect(props.callback).toBeCalledWith();
        }
        expect(reactor.evaluate(getters.DialogueBox).get('displayed')).toBe(false);
    }

    it('works with "error"', () => {
        const props = {type: 'error', message: 'A', detail: 'B', callback: jest.genMockFn()};
        const expIconClass = 'exclamation-triangle';
        const expTitle = 'Error';
        dialogueBoxTester(props, expIconClass, expTitle);
    });

    it('works with "warn"', () => {
        const props = {type: 'warn', message: 'A', detail: 'B', callback: jest.genMockFn()};
        const expIconClass = 'exclamation-circle';
        const expTitle = 'Warning';
        dialogueBoxTester(props, expIconClass, expTitle);
    });

    it('works with "info"', () => {
        const props = {type: 'info', message: 'A', detail: 'B', callback: jest.genMockFn()};
        const expIconClass = 'info-circle';
        const expTitle = 'Information';
        dialogueBoxTester(props, expIconClass, expTitle);
    });

    it('works with "debug"', () => {
        const props = {type: 'debug', message: 'A', detail: 'B', callback: jest.genMockFn()};
        const expIconClass = 'bug';
        const expTitle = 'Developer Message';
        dialogueBoxTester(props, expIconClass, expTitle);
    });

    it('works with "question"', () => {
        const props = {type: 'question', message: 'A', detail: 'B', callback: jest.genMockFn()};
        const expIconClass = 'question-circle';
        const expTitle = 'Question';
        const answer = '42';
        dialogueBoxTester(props, expIconClass, expTitle, answer);
    });
});
