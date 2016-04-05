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

export const TerminalView = React.createClass({
    // NOTE: if the output isn't changing, you can use ``null`` for props.outputType
    propTypes: {
        title: React.PropTypes.string,
        termOutput: React.PropTypes.string,
        stdin: React.PropTypes.string.isRequired,
        stdout: React.PropTypes.string.isRequired,
        stderr: React.PropTypes.string.isRequired
    },
    getDefaultProps() {
        return {
            title: 'Terminal',
            termOutput: 'in'
        };
    },
    whichOutput() {
        let termOutput = this.props.termOutput;
        if(termOutput === 'out' || termOutput === 'stdout') {
            return <TerminalWindow extraClass="nc-terminal-out" outputThis={this.props.stdout}/>
        } else if(termOutput === 'err' || termOutput === 'stderr') {
            return <TerminalWindow extraClass="nc-terminal-err" outputThis={this.props.stderr}/>
        } else {
            return <TerminalWindow extraClass="nc-terminal-in" outputThis={this.props.stdin}/>
        }
    },
    whichTitle() {
        let title = this.props.title;
        if(title === 'Terminal'){
            title = title + "-" + this.props.termOutput.toUpperCase();
            return title;
        } else {
            return title;
        }
    },
    render() {
        return (
            <div className="nc-terminal-container">
                <div className="pane-head">
                    <h2>{this.whichTitle()}</h2>
                </div>
                <CustomScrollbars>
                    {this.whichOutput()}
                </CustomScrollbars>
            </div>
        );
    },
});

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
