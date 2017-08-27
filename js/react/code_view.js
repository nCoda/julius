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

import CodeModeLilypond from './code_mode_lilypond';
import CodeModePython from './code_mode_python';
import CodeModeMEI from './code_mode_mei';


const TABS = {
    MEI: 3,
    LILYPOND: 2,
    PYTHON: 1,
};


const CodeView = React.createClass({
    propTypes: {
        lilyCurrent: React.PropTypes.string,
        renderPDF: React.PropTypes.func.isRequired,
        submitLilyPond: React.PropTypes.func.isRequired,
        submitPython: React.PropTypes.func.isRequired,
    },

    getDefaultProps() {
        return {
            lilyCurrent: '',
            renderPDF: () => {},
            submitLilyPond: () => {},
            submitPython: () => {},
        };
    },

    getInitialState() {
        return {
            currentTab: TABS.LILYPOND,
        };
    },

    handleSelect(key) {
        this.setState({
            currentTab: key,
        });
    },

    render() {
        return (
            <Tabs defaultActiveKey={this.state.currentTab} onSelect={this.handleSelect} justify>
                <Tabs.Item eventKey={TABS.PYTHON} title="Python" className="python">
                    <CodeModePython
                        submitFunction={this.props.submitPython}
                        active={this.state.currentTab === TABS.PYTHON}
                    />
                </Tabs.Item>
                <Tabs.Item eventKey={TABS.LILYPOND} title="LilyPond" className="lilypond">
                    <CodeModeLilypond
                        renderPDF={this.props.renderPDF}
                        submitFunction={this.props.submitLilyPond}
                        active={this.state.currentTab === TABS.LILYPOND}
                        initialValue={this.props.lilyCurrent}
                    />
                </Tabs.Item>
                <Tabs.Item eventKey=TABS.MEI title="MEI" className="mei">
                    <CodeModeMEI
                        active={this.state.currentTab === TABS.MEI}
                    />
                </Tabs.Item>
            </Tabs>
        );
    },
});

export default CodeView;
