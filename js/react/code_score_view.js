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
import TerminalView from './terminal_view';

import reactor from '../nuclear/reactor';
import signals from '../nuclear/signals';
import getters from '../nuclear/getters';

import store from '../stores';
import { getters as docGetters } from '../stores/document';

import SplitPane from '../../node_modules/react-split-pane/lib/SplitPane';  // TODO: import properly


const CodeScoreView = React.createClass({
    mixins: [reactor.ReactMixin],
    getDefaultProps() {
        return {meiForVerovio: ''};
    },
    getDataBindings() {
        return {
            meiForVerovio: getters.meiForVerovio,
        };
    },
    componentWillMount() {
        signals.emitters.registerOutboundFormat('document', 'codescoreview', false);
        signals.emitters.registerOutboundFormat('lilypond', 'codescoreview', false);
    },
    componentWillUnmount() {
        signals.emitters.unregisterOutboundFormat('document', 'codescoreview');
        signals.emitters.unregisterOutboundFormat('lilypond', 'codescoreview');
    },
    render() {
        // TODO: remove "sectId" when no longer needed by <ScoreView>
        const sectId = docGetters.cursor(store.getState()).first();

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
                            <TerminalView termOutput="in" title="Your Input"/>
                        </div>
                        <div className="pane-container">
                            <TerminalView termOutput="out" title="Python Output"/>
                        </div>
                    </SplitPane>
                </SplitPane>
            </div>
        );
    },
});


export default CodeScoreView;
