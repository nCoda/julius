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

import getters from '../nuclear/getters';  // TODO: temporary for T50?
import reactor from '../nuclear/reactor';  // TODO: temporary for T50?

import CodeMirror from './codemirror';
import {Button, ButtonGroup} from 'amazeui-react';
import Scroll from './scroll';
import {Icon} from './svg_icons';


const SubmitCodeButton = React.createClass({
    propTypes: {
        amSize: React.PropTypes.oneOf(['xl', 'lg', 'default', 'sm', 'xs']),
        amStyle: React.PropTypes.oneOf([
            'default', 'primary', 'secondary', 'success', 'warning', 'danger', 'link',
        ]),
        codeLanguage: React.PropTypes.oneOf(['python', 'lilypond']).isRequired,
        displayText: React.PropTypes.string,
        hoverText: React.PropTypes.string,
        logo: React.PropTypes.bool,
        onClick: React.PropTypes.func.isRequired,
    },
    getDefaultProps() {
        return {
            amSize: 'xs',
            amStyle: 'default',
            displayText: '',
            hoverText: '',
            logo: false,
        };
    },
    render() {
        let logo = null;
        if (this.props.logo) {
            logo = <Icon type={this.props.codeLanguage} />;
        }
        return (
            <Button
                title={this.props.hoverText}
                amSize={this.props.amSize}
                amStyle={this.props.amStyle}
                onClick={this.props.onClick}
            >
                {logo}{this.props.displayText}
            </Button>
        );
    },
});

export const CodeView = React.createClass({
    propTypes: {
        submitToLychee: React.PropTypes.func.isRequired,
        submitToPyPy: React.PropTypes.func.isRequired,
        title: React.PropTypes.string,
    },
    getDefaultProps() {
        return {
            title: 'Code Editor',
        };
    },
    getInitialState() {
        return {
            editorValue: '',
            timesTheStupidHackFunctionRan: 0,  // TODO: temporary for T50?
        };
    },
    handleEditorChange(withThis) {
        this.setState({editorValue: withThis});
    },
    handleSubmitPython() {
        this.props.submitToPyPy(this.state.editorValue);
    },
    handleSubmitLilyPond() {
        this.props.submitToLychee(this.state.editorValue, 'lilypond');
    },
    shouldComponentUpdate(nextProps, nextState) {
        return nextState.editorValue !== this.state.editorValue;
    },
    stupidHackFunction() {
        // TODO: temporary for T50?
        const cursor = reactor.evaluate(getters.sectionCursor);
        const lilySections = reactor.evaluate(getters.lilypond);
        if (lilySections.has(cursor.last())) {
            this.setState({editorValue: lilySections.get(cursor.last())});
        }
        else {
            this.setState({timesTheStupidHackFunctionRan: this.state.timesTheStupidHackFunctionRan + 1});
            if (this.state.timesTheStupidHackFunctionRan < 10) {
                window.setTimeout(this.stupidHackFunction, 500);
            }
        }
    },
    componentDidMount() {
        this.stupidHackFunction();
    },
    render() {
        return (
            <div>
                <div className="pane-head">
                    <h2>{this.props.title}</h2>
                    <div className="ncoda-text-editor-controls">
                        <ButtonGroup>
                            <SubmitCodeButton
                                codeLanguage={"python"}
                                onClick={this.handleSubmitPython}
                                logo
                                hoverText={"Run as Python"}
                            />
                            <SubmitCodeButton
                                codeLanguage={"lilypond"}
                                onClick={this.handleSubmitLilyPond}
                                logo
                                hoverText={"Submit as Lilypond"}
                            />
                        </ButtonGroup>
                    </div>
                </div>
                <Scroll>
                    <CodeMirror
                        onChange={this.handleEditorChange}
                        text={this.state.editorValue}
                    />
                </Scroll>
            </div>
        );
    },
});
