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

import React from 'react';
import { connect } from 'react-redux';

import CodeView from './code_view';
import { ScoreView } from './score_view';
import TerminalView from './terminal_view';

import { signals } from '../nuclear/signals';

import { store } from '../stores';
import { getters as lilyGetters } from '../stores/lilypond';

import SplitPane from 'react-split-pane';


/** CodeScoreView
 *
 * Props
 * -----
 * @param {string} lilyCurrent - "latest" LilyPond version of the active <section> (from Redux)
 */
const CodeScoreView = React.createClass({
    propTypes: {
        lilyCurrent: React.PropTypes.string,
    },

    componentWillMount() {
        signals.emitters.registerOutboundFormat('document', 'codescoreview', false);
        signals.emitters.registerOutboundFormat('lilypond', 'codescoreview', false);
    },

    componentWillUnmount() {
        signals.emitters.unregisterOutboundFormat('document', 'codescoreview');
        signals.emitters.unregisterOutboundFormat('lilypond', 'codescoreview');
    },

    submitToMEI() {
      // placeholder
        console.log('submitToMEI placeholder function triggered');
    },

    render() {
        return (
            <div id="nc-csv-frame">
                <SplitPane
                    split="horizontal"
                    minSize={20} // sizes apply to top half (Code and Score panes)
                    maxSize={-20}
                    defaultSize="70%"
                >
                    <SplitPane
                        split="vertical"
                        className="ncoda-work-table"
                        minSize={20} // sizes apply to ScoreView pane
                        maxSize={-20}
                        defaultSize="60%"
                        primary="second"
                    >
                        <div className="ncoda-text-editor pane-container">
                            <CodeView
                                lilyCurrent={this.props.lilyCurrent || ''}
                                submitToLychee={signals.emitters.submitToLychee}
                                submitToPyPy={signals.emitters.submitToPyPy}
                                submitToMEI={this.submitToMEI}
                            />
                        </div>
                        <div className="ncoda-scoreview pane-container">
                            <ScoreView />
                        </div>
                    </SplitPane>
                    <SplitPane
                        split="vertical"
                        id="ncoda-terminal-output"
                        className="ncoda-terminal-output"
                        minSize={20} // sizes apply to TerminalView Input pane
                        maxSize={-20}
                        defaultSize="50%"
                    >
                        <div className="pane-container">
                            <TerminalView termOutput="in" title="Your Input" />
                        </div>
                        <div className="pane-container">
                            <TerminalView termOutput="out" title="Python Output" />
                        </div>
                    </SplitPane>
                </SplitPane>
            </div>
        );
    },
});


const CodeScoreViewWrapper = connect((state) => {
    return {
        lilyCurrent: lilyGetters.current(state),
    };
})(CodeScoreView);
export default CodeScoreViewWrapper;
