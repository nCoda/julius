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

import SplitPane from '../../node_modules/react-split-pane/lib/SplitPane';
import {createNewVidaView} from '../nuclear/stores/verovio';

import {CodeView} from './code_view';
import {ScoreView} from './score_view';
import {TerminalView} from './terminal_view';

import reactor from '../nuclear/reactor';
import signals from '../nuclear/signals';
import getters from '../nuclear/getters';

import {log} from '../util/log';


/** Verovio: a React container for Vida6.
 *
 * Props:
 * ------
 * @param {str} sectId: The @xml:id attribute of the <section> to display.
 *
 * NOTE: this component does not update in the usual React way because it is a React wrapper around
 *       Vida6. The data rendered by Vida6 is managed in the "verovio" NuclearJS Store file.
 */
const Verovio = React.createClass({
    propTypes: {
        sectId: React.PropTypes.string.isRequired,
    },
    mixins: [reactor.ReactMixin],
    getDataBindings() {
        return {meiForVerovio: getters.meiForVerovio};
    },
    componentWillMount() {
        signals.emitters.registerOutboundFormat('verovio', 'Verovio component');
        signals.emitters.lyGetSectionById(this.props.sectId);
    },
    componentDidMount() { // Create the vidaView
        signals.emitters.addNewVidaView(this.refs.verovioFrame, this.props.sectId);
    },
    componentWillReceiveProps(nextProps) {
        if (this.props.sectId !== nextProps.sectId) {
            signals.emitters.destroyVidaView(this.props.sectId);
        }
    },
    shouldComponentUpdate(nextProps, nextState) {
        // if the sectIds don't line up, we want to re-render
        if (this.props.sectId !== nextProps.sectId) {
            return true;
        }
        return false;
    },
    componentDidUpdate() { // Create the vidaView
        signals.emitters.addNewVidaView(this.refs.verovioFrame, this.props.sectId);
    },
    componentWillUnmount() {
        signals.emitters.unregisterOutboundFormat('verovio', 'Verovio component');
        signals.emitters.destroyVidaView(this.props.sectId);
    },
    render() {
        return <div className="ncoda-verovio" ref="verovioFrame"/>;
    },
});

const CodeScoreView = React.createClass({
    mixins: [reactor.ReactMixin],
    getDefaultProps() {
        return {meiForVerovio: '', sendToConsole: '', sendToConsoleType: null};
    },
    getDataBindings() {
        return {
            meiForVerovio: getters.meiForVerovio,
            sectionCursor: getters.sectionCursor,
            stdin: getters.stdin,
            stdout: getters.stdout,
            stderr: getters.stderr
        }
    },
    getInitialState() {
        return {
            sendToConsole: 'nCoda is ready for action!',
            sendToConsoleType: 'welcome',
        };
    },
    render() {
        const sectId = this.state.sectionCursor.last() || 'Sme-s-m-l-e8726689';
        if (!this.state.sectionCursor.last()) {
            log.debug('Document cursor is not set; using default section');
        }
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
                            <ScoreView ref="verovio"
                                       sectId={sectId}
                                       lyGetSectionById={signals.emitters.lyGetSectionById}
                                       meiForVerovio={this.state.meiForVerovio}
                                       registerOutboundFormat={signals.emitters.registerOutboundFormat}
                                       unregisterOutboundFormat={signals.emitters.unregisterOutboundFormat}
                                       addNewVidaView={signals.emitters.addNewVidaView}
                                       destroyVidaView={signals.emitters.destroyVidaView}
                        />
                        </div>
                    </SplitPane>
                    <SplitPane split="vertical"
                               id="ncoda-terminal-output"
                               className="ncoda-terminal-output"
                               primary="second"
                               minSize="20"
                               defaultSize="50%">
                        <div className="pane-container">
                            <TerminalView ref="terminalIn"
                                          termOutput="in"
                                          title="Your Input"
                                          stdin={this.state.stdin}
                                          stdout={this.state.stdout}
                                          stderr={this.state.stderr}
                            />
                        </div>
                        <div className="pane-container">
                            <TerminalView ref="terminalOut"
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
