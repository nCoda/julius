// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/code_view.js
// Purpose:                React components for CodeView module of CodeScoreView.
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

import CodeMirror from './codemirror';
import {Button, ButtonGroup} from 'amazeui-react';
import Scroll from './scroll';
import {IconPython, IconLilypond} from './svg_icons';


export const CodeView = React.createClass({
    propTypes: {
        submitToLychee: React.PropTypes.func.isRequired,
        submitToPyPy: React.PropTypes.func.isRequired,
        title: React.PropTypes.string
    },
    getDefaultProps() {
        return {
            title: 'Code Editor'
        };
    },
    getInitialState() {
        return {editorValue: ''};
    },
    handleEditorChange(withThis) {
        this.setState({editorValue: withThis});
    },
    render() {
        return (
            <div>
                <div className="pane-head">
                    <h2>{this.props.title}</h2>
                    <CodeViewButtons submitToPyPy={this.props.submitToPyPy}
                                     submitToLychee={this.props.submitToLychee}
                                     editorValue={this.state.editorValue}/>
                </div>
                <Scroll>
                    <CodeMirror
                        onChange={this.handleEditorChange}
                    />
                </Scroll>
            </div>
        );
    },
});

const CodeViewButtons = React.createClass({
    propTypes: {
        submitToLychee: React.PropTypes.func.isRequired,
        submitToPyPy: React.PropTypes.func.isRequired,
        editorValue: React.PropTypes.string.isRequired,
    },
    handleSubmitPython() {
        this.props.submitToPyPy(this.props.editorValue);
    },
    handleSubmitLilyPond() {
        this.props.submitToLychee(this.props.editorValue, 'lilypond');
    },
    render() {
        return (
            <div className="ncoda-text-editor-controls">
                <ButtonGroup>
                    <Button title="Run as Python" className="am-btn-xs" onClick={this.handleSubmitPython}>
                        <IconPython />
                    </Button>
                    <Button title="Submit as Lilypond" className="am-btn-xs" onClick={this.handleSubmitLilyPond}>
                        <IconLilypond />
                    </Button>
                </ButtonGroup>
            </div>
        )
    }
});
