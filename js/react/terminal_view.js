// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/score_view.js
// Purpose:                React components for TerminalView module of CodeScoreView.
//
// Copyright (C) 2016 Sienna M. Wood, Christopher Antila
// Copyright (C) 2017 Sienna M. Wood
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
import { connect } from 'react-redux';

import Scroll from './scroll';
import { getters as metaGetters } from '../stores/meta';


const TerminalView = React.createClass({
    propTypes: {
        stdin: React.PropTypes.string,
        stderr: React.PropTypes.string,
        stdout: React.PropTypes.string,
        termOutput: React.PropTypes.oneOf(['stdin', 'in', 'stdout', 'out', 'stderr', 'err']),
        title: React.PropTypes.string,

    },
    getDefaultProps() {
        return {
            stdin: '',
            stderr: '',
            stdout: '',
            termOutput: 'in',
            title: 'Terminal',
        };
    },
    componentDidMount() {
        this.scrollToBottom();
    },
    componentDidUpdate() {
        this.scrollToBottom();
    },
    componentWillUnmount() {
        this.divAtTheBottom = undefined;
    },
    scrollToBottom() {
        // empty div at end of output to allow automatic scrolling
        if (this.divAtTheBottom && this.divAtTheBottom.scrollIntoView && this.divAtTheBottom.scrollIntoView()) {
            this.divAtTheBottom.scrollIntoView();
        }
    },
    render() {
        let className;
        let outputThis;
        switch (this.props.termOutput) {
        default:
        case 'in':
        case 'stdin':
            className = 'ncoda-terminal-window nc-terminal-in';
            outputThis = this.props.stdin;
            break;

        case 'out':
        case 'stdout':
            className = 'ncoda-terminal-window nc-terminal-out';
            outputThis = this.props.stdout;
            break;

        case 'err':
        case 'stderr':
            className = 'ncoda-terminal-window nc-terminal-err';
            outputThis = this.props.stderr;
            break;
        }

        return (
            <div className="nc-terminal-container">
                <div className="pane-head">
                    <h2>
                        {this.props.title ? this.props.title : `Terminal (${this.props.termOutput})`}
                    </h2>
                </div>
                <Scroll>
                    <div className={className}>
                        <pre dangerouslySetInnerHTML={{ __html: outputThis }} />
                    </div>
                    <div ref={(el) => { this.divAtTheBottom = el; }} />
                </Scroll>
            </div>
        );
    },
});


const TerminalViewWrapped = connect((state) => {
    return {
        stdin: metaGetters.stdin(state),
        stdout: metaGetters.stdout(state),
        stderr: metaGetters.stderr(state),
    };
})(TerminalView);

export default TerminalViewWrapped;
