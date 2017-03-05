// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/code_view.js
// Purpose:                React components for CodeView module of CodeScoreView.
//
// Copyright (C) 2016, 2017 Sienna M. Wood
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

import { Tabs } from 'amazeui-react';
import CodeMode from './code_mode';


const CodeView = React.createClass({
    propTypes: {
        submitToLychee: React.PropTypes.func.isRequired,
        submitToPyPy: React.PropTypes.func.isRequired,
        submitToMEI: React.PropTypes.func.isRequired,
        lilyCurrent: React.PropTypes.string,
    },
    getDefaultProps() {
        return {
            lilyCurrent: '',
        };
    },
    getInitialState() {
        return {
            currentTab: '2', // Lilypond tab
        };
    },
    handleSelect(key) {
        this.setState({
            currentTab: key,
        });
    },
    render() {
        const ly = 'lilypond';
        const py = 'python';
        const mei = 'mei';

        return (
            <Tabs defaultActiveKey={this.state.currentTab} onSelect={this.handleSelect} justify>
                <Tabs.Item eventKey="1" title={"Python"} className={py}>
                    <CodeMode
                        codeLanguage={py}
                        submitFunction={this.props.submitToPyPy}
                        active={this.state.currentTab === '1'}
                    />
                </Tabs.Item>
                <Tabs.Item eventKey="2" title={"LilyPond"} className={ly}>
                    <CodeMode
                        codeLanguage={ly}
                        submitFunction={this.props.submitToLychee}
                        active={this.state.currentTab === '2'}
                        initialValue={this.props.lilyCurrent}
                    />
                </Tabs.Item>
                <Tabs.Item eventKey="3" title={"MEI"} className={mei}>
                    <CodeMode
                        codeLanguage={mei}
                        active={this.state.currentTab === '3'}
                        submitFunction={this.props.submitToMEI}
                    />
                </Tabs.Item>
            </Tabs>
        );
    },
});

export default CodeView;
