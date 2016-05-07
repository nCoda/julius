// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/code_score_view.js
// Purpose:                React components for CodeScoreView.
//
// Copyright (C) 2015 Wei Gao
// Copyright (C) 2016 Christopher Antila, Sienna M. Wood, Andrew Horwitz
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

import {CodeView} from './code_view';
import {ScoreView} from './score_view';
import {TerminalView} from './terminal_view';

import reactor from '../nuclear/reactor';
import signals from '../nuclear/signals';
import getters from '../nuclear/getters';

import SplitPane from '../../node_modules/react-split-pane/lib/SplitPane';


const CodeScoreView = React.createClass({
    mixins: [reactor.ReactMixin],
    getDefaultProps() {
        return {meiForVerovio: '', sendToConsole: '', sendToConsoleType: null};
    },
    getDataBindings() {
        return {
            meiForVerovio: getters.meiForVerovio,
            sections: getters.sections,
            sectionCursor: getters.sectionCursorFriendly,
            stdin: getters.stdin,
            stdout: getters.stdout,
            stderr: getters.stderr,
        };
    },
    getInitialState() {
        return {
            sendToConsole: 'nCoda is ready for action!',
            sendToConsoleType: 'welcome',
        };
    },
    componentWillMount() {
        signals.emitters.registerOutboundFormat('document', 'codescoreview', false);
    },
    componentDidMount() {
        // If the document cursor is not set, we need to choose a default.
        this.checkForValidCursor(this.state.sections, this.state.sectionCursor);
    },
    componentWillUpdate(nextProps, nextState) {
        // If the document cursor is not set, we need to choose a default.
        if (nextState.sections !== this.state.sections
            || nextState.sectionCursor !== this.state.sectionCursor) {
            this.checkForValidCursor(nextState.sections, nextState.sectionCursor);
        }
    },
    componentWillUnmount() {
        signals.emitters.unregisterOutboundFormat('document', 'codescoreview');
    },
    checkForValidCursor(sections, cursor) {
        if (sections.size === 0) {
            // the section data aren't loaded yet, so we'll just quit
            return;
        }
        if (cursor.size === 0) {
            signals.emitters.moveSectionCursor([sections.get('score_order').get(0)]);
        }
    },
    render() {
        const sectId = this.state.sectionCursor.last();

        let scoreView;
        if (sectId) {
            scoreView = (
                <ScoreView
                    sectId={sectId}
                    lyGetSectionById={signals.emitters.lyGetSectionById}
                    meiForVerovio={this.state.meiForVerovio}
                    registerOutboundFormat={signals.emitters.registerOutboundFormat}
                    unregisterOutboundFormat={signals.emitters.unregisterOutboundFormat}
                    addNewVidaView={signals.emitters.addNewVidaView}
                    destroyVidaView={signals.emitters.destroyVidaView}
                />
            );
        }
        else {
            scoreView = (
                <div>
                    <p>{`A score will show up when the section cursor is set.`}</p>
                    <p>{`If the score doesn't show up in a moment, try running this code:`}</p>
                    <pre>{`lychee.signals.ACTION_START.emit()`}</pre>
                    <p>{`That only works if there are sections in the score to begin with.`}</p>
                </div>
            );
        }

        return (
            <div id="nc-csv-frame">
                <SplitPane split="horizontal" minSize="20" defaultSize="70%">
                    <SplitPane
                        split="vertical"
                        className="ncoda-work-table"
                        primary="second"
                        minSize="20"
                        defaultSize="60%"
                    >
                        <div className="ncoda-text-editor pane-container">
                            <CodeView
                                submitToPyPy={signals.emitters.submitToPyPy}
                                submitToLychee={signals.emitters.submitToLychee}
                            />
                        </div>
                        <div className="ncoda-verovio pane-container">
                            {scoreView}
                        </div>
                    </SplitPane>
                    <SplitPane
                        split="vertical"
                        id="ncoda-terminal-output"
                        className="ncoda-terminal-output"
                        primary="second"
                        minSize="20"
                        defaultSize="50%"
                    >
                        <div className="pane-container">
                            <TerminalView
                                termOutput="in"
                                title="Your Input"
                                stdin={this.state.stdin}
                                stdout={this.state.stdout}
                                stderr={this.state.stderr}
                            />
                        </div>
                        <div className="pane-container">
                            <TerminalView
                                termOutput="out"
                                title="Python Output"
                                stdin={this.state.stdin}
                                stdout={this.state.stdout}
                                stderr={this.state.stderr}
                            />
                        </div>
                    </SplitPane>
                </SplitPane>
            </div>
        );
    },
});


export default CodeScoreView;
