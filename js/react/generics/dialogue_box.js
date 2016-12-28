// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/generics/dialogue_box.js
// Purpose:                Generic React components for nCoda in general.
//
// Copyright (C) 2016 Christopher Antila, Sienna M. Wood
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

import { Icon, Modal } from 'amazeui-react';
import React from 'react';
import { connect } from 'react-redux';

import { log } from '../../util/log';

import { actions as uiActions, getters as uiGetters } from '../../stores/ui';


/** DialgoueBox: Display alerts using amazeUI modal components
 *
 * No props - everything is passed in through NuclearJS
 *
 * Tests in tests/test_generics.js
 */
// NB: the "Unwrapped" component is simply the one before wrapping with Redux.
export const DialogueBoxUnwrapped = React.createClass({
    propTypes: {
        displayed: React.PropTypes.bool,
        type: React.PropTypes.oneOf(['debug', 'error', 'info', 'question', 'warn']),
        message: React.PropTypes.string,
        detail: React.PropTypes.string,
        callback: React.PropTypes.func,
    },

    getDefaultProps() {
        return {
            displayed: false,
            type: 'info',
            message: '?',
            detail: '?',
            callback: () => {},
        };
    },

    getInitialState() {
        return {answer: ''};
    },

    componentDidMount: function() {
        this._documentKeyupListener = window.addEventListener('keyup', this.handleKeyUp);
    },
    componentWillUnmount: function() {
        this._documentKeyupListener.off();
    },
    handleInputChange(text) {
        this.setState({answer: text});
    },
    handleKeyUp(e) {
        if (!this.props.keyboard && e.keyCode === 13) { // keyCode 13 is enter
            this.handleClick();
        }
    },
    handleClick() {
        // We can't guarantee the callback won't crash, so let's hide ourselves first.
        uiActions.hideModal();
        if (this.props.type === 'question') {
            const answer = this.state.answer;
            log.debug(`QuestionBox answered with "${answer}".`);
            this.props.callback(answer);
        }
        else {
            this.props.callback();
        }
    },
    handleConfirm() {
        this.handleClick();
    },
    handleCancel() {
        this.handleClick();
    },
    render() {
        if (!this.props.displayed) {
            return <div style={{display: 'none'}}/>;
        }

        let iconClass, type;
        let modalType = 'alert';

        switch (this.props.type) {
            case 'error':
                iconClass = 'exclamation-triangle';
                type = 'Error';
                break;
            case 'warn':
                iconClass = 'exclamation-circle';
                type = 'Warning';
                break;
            case 'debug':
                iconClass = 'bug';
                type = 'Developer Message';
                break;
            case 'question':
                iconClass = 'question-circle';
                type = 'Question';
                modalType = 'prompt';
                break;
            case 'info':
            default:
                iconClass = 'info-circle';
                type = 'Information';
                break;
        }

        let answer;
        if (type === 'Question') {
            answer = (
                <input
                    type="text"
                    value={this.state.value}
                    onChange={this.handleInputChange}
                />
            );
        }

        return (
            <Modal
                type={modalType}
                confirmText="OK"
                cancelText="Cancel"
                onConfirm={this.handleConfirm}
                onCancel={this.handleCancel}
                onRequestClose={this.handleClick}
                title={<Icon icon={iconClass} amSize="md" alt={type}/>}
            >
                <h1>{this.props.message}</h1>
                <p>{this.props.detail}</p>
                {answer}
            </Modal>
        );
    },
});


export const DialogueBox = connect((state) => {
    return {
        displayed: uiGetters.modalDisplayed(state),
        type: uiGetters.modalType(state),
        message: uiGetters.modalMessage(state),
        detail: uiGetters.modalDetail(state),
        callback: uiGetters.modalCallback(state),
    };
})(DialogueBoxUnwrapped);


export default DialogueBox;
