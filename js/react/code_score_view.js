// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/code_score_view.js
// Purpose:                React components for CodeScoreView.
//
// Copyright (C) 2015 Wei Gao
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
// ------------------------------------------------------------------------------------------------

import React from 'react';

import SplitPane from '../../node_modules/react-split-pane/lib/SplitPane';
import CustomScrollbars from './custom_scrollbars';

import {CodeView} from './code_view';
import {ScoreView} from './score_view';
import {TerminalViewIn, TerminalViewOut} from './terminal_view';

import getters from '../nuclear/getters';
import reactor from '../nuclear/reactor';
import signals from '../nuclear/signals';



const CodeScoreView = React.createClass({
    propTypes: {
        meiForVerovio: React.PropTypes.string,
    },
    getDefaultProps() {
        return {meiForVerovio: '', sendToConsole: '', sendToConsoleType: null};
    },
    getInitialState() {
        return {
            sendToConsole: 'nCoda is ready for action!',
            sendToConsoleType: 'welcome',
        };
    },
    render() {
        return (
            <div id="nc-csv-frame">
                <SplitPane split="horizontal" minSize="20" defaultSize="70%">
                    <SplitPane split="vertical"
                               ref="workTable"
                               className="ncoda-work-table"
                               primary="second"
                               minSize="20"
                               defaultSize="60%">
                        <div className="ncoda-text-editor pane-container">
                            <CodeView
                                ref="codeView"
                                submitToPyPy={signals.emitters.submitToPyPy}
                                submitToLychee={signals.emitters.submitToLychee}
                            />
                        </div>
                        <div className="ncoda-verovio pane-container">
                            <CustomScrollbars>
                                <ScoreView ref="verovio" meiForVerovio={this.props.meiForVerovio} />
                            </CustomScrollbars>
                        </div>
                    </SplitPane>
                    <SplitPane split="vertical"
                               id="ncoda-terminal-output"
                               className="ncoda-terminal-output"
                               primary="second"
                               minSize="20"
                               defaultSize="50%">
                        <div className="pane-container">
                            <div className="pane-head">
                                <h2>{`Your Input`}</h2>
                            </div>
                            <CustomScrollbars>
                                <TerminalViewIn ref="terminalIn"/>
                            </CustomScrollbars>
                        </div>
                        <div className="pane-container">
                            <div className="pane-head">
                                <h2>{`Python Output`}</h2>
                            </div>
                            <CustomScrollbars>
                                <TerminalViewOut ref="terminalOut"/>
                            </CustomScrollbars>
                        </div>
                    </SplitPane>
                </SplitPane>
            </div>
        );
    },
});


export default CodeScoreView;
