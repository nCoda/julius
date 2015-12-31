// -*- coding: utf-8 -*-
//-------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/generics.js
// Purpose:                Generic React components for nCoda in general.
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

// NOTE: This module contains generic components, like "question box." Widely-used but specific
// components, such as the global menu bar, are stored in "ncoda.js."


import React from 'react';

import {log} from '../util/log';
import {getters} from '../nuclear/getters';
import {reactor} from '../nuclear/reactor';
import {emitters as signals} from '../nuclear/signals';


var ModalBackground = React.createClass({
    // This component is a semi-transparent background that appears behind the global menu bar, but
    // in front of everything else. Child components will, of course, be in front of the background.
    //
    // The background fills all the available screen space. Children are "flexboxxed" vertically.
    //
    render() {
        return (
            <div className="nc-modal-background">
                {this.props.children}
            </div>
        );
    },
});


var DialogueBox = React.createClass({
    //
    //

    mixins: [reactor.ReactMixin],
    getDataBindings: function() {
        return {box: getters.DialogueBox};
    },
    onClick() {
        if (this.state.box.get('callback')) {
            if ('question' === this.state.box.get('type')) {
                let answer = this.refs.answer.value;
                log.debug(`QuestionBox answered with "${answer}".`);
                this.state.box.get('callback')(answer);
            }
            else {
                this.state.box.get('callback')();
            }
        }
        signals.dialogueBoxHide();
    },
    render() {
        if (!this.state.box.get('displayed')) {
            return <div style={{display: 'none'}}/>;
        }

        let iconClass, title;

        switch (this.state.box.get('type')) {
            case 'error':
                iconClass = 'exclamation-triangle';
                title = 'Error';
                break;
            case 'warn':
                iconClass = 'exclamation-circle';
                title = 'Warning';
                break;
            case 'info':
                iconClass = 'info-circle';
                title = 'Information';
                break;
            case 'debug':
                iconClass = 'bug';
                title = 'Developer Message';
                break;
            case 'question':
                iconClass = 'question-circle';
                title = 'Question';
                break;
        }

        iconClass = `fa fa-${iconClass}`;
        let boxClass = `nc-dialogue-box nc-dialogue-${this.state.box.get('type')}`;

        let detail = '';
        if (this.state.box.get('detail')) {
            detail = <p className="nc-dialogue-detail">{this.state.box.get('detail')}</p>;
        }

        let answer = '';
        if ('question' === this.state.box.get('type')) {
            answer  = <input type="text" ref="answer"/>;
        }

        return (
            <ModalBackground>
                <div className={boxClass}>
                    <div className="nc-dialogue-type">
                        <i className={iconClass}/><h3>{title}</h3>
                    </div>
                    <p className="nc-dialogue-msg">{this.state.box.get('message')}</p>
                    {detail}
                    {answer}
                    <button className="btn" onClick={this.onClick}>OK</button>
                </div>
            </ModalBackground>
        );
    },
});


export {DialogueBox, ModalBackground};
