// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/score_view.js
// Purpose:                React components for TerminalView module of CodeScoreView.
//
// Copyright (C) 2016 Sienna M. Wood
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

import React from 'react';

import CustomScrollbars from './custom_scrollbars';

import getters from '../nuclear/getters';
import reactor from '../nuclear/reactor';

const TerminalWindow = React.createClass({
    propTypes: {
        outputThis: React.PropTypes.string,
        extraClass: React.PropTypes.string,
    },
    getDefaultProps() {
        return {
            outputThis: '',
            extraClass: ''
        };
    },
    formatString(outputThis) {
        // Formats a string properly so it can be outputted in the window as dangerouslySetInnerHTML.
        //
        let post = outputThis;

        // TODO: how to make this replace all occurrences?
        // TODO: how to avoid other possible attacks?
        while (post.includes('<')) {
            post = post.replace('<', '&lt;');
        }
        while (post.includes('>')) {
            post = post.replace('>', '&gt;');
        }

        // convert newlines to <br/>
        while (post.includes('\n')) {
            post = post.replace('\n', '<br/>');
        }

        // finally append our thing
        if (!post.endsWith('<br/>')) {
            post += '<br/>';
        }
        // wrap the output in <pre> tag to preserve spaces and tabs.
        post = `<pre>${post}</pre>`;
        return post;
    },
    render() {
        const innerHtml = {__html: this.formatString(this.props.outputThis)};
        let className = 'ncoda-terminal-window ';
        if (this.props.extraClass !== '') {
            className += `${className} ${this.props.extraClass}`;
        }
        return (
            <div className={className} dangerouslySetInnerHTML={innerHtml}></div>
        );
    },
});


export const TerminalView = React.createClass({
    // NOTE: if the output isn't changing, you can use ``null`` for props.outputType
    mixins: [reactor.ReactMixin],
    propTypes: {
        title: React.PropTypes.string,
        termOutput: React.PropTypes.string,
    },
    getDefaultProps() {
        return {
            title: 'Your Input',
            termOutput: 'in'
        };
    },
    getDataBindings() {
        return {stdin: getters.stdin, stdout: getters.stdout, stderr: getters.stderr};
    },
    whichOutput() {
        if(this.props.termOutput === 'out' || this.props.termOutput === 'stdout') {
            return <TerminalWindow extraClass="nc-terminal-out" outputThis={this.state.stdout}/>
        } else if(this.props.termOutput === 'err' || this.props.termOutput === 'stderr') {
            return <TerminalWindow extraClass="nc-terminal-err" outputThis={this.state.stderr}/>
        } else {
            return <TerminalWindow extraClass="nc-terminal-in" outputThis={this.state.stdin}/>
        }
    },
    render() {
        return (
            <div className="nc-terminal-container">
                <div className="pane-head">
                    <h2>{this.props.title}</h2>
                </div>
                <CustomScrollbars>
                    {this.whichOutput()}
                </CustomScrollbars>
            </div>
        );
    },
});
