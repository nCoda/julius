// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/code_mode.js
// Purpose:                React components for individual code modes in CodeView.
//
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

import { CodeMirror } from './codemirror';
import { Button } from 'amazeui-react';
import { Icon } from './svg_icons';

const CodeMode = React.createClass({
    propTypes: {
        codeLanguage: React.PropTypes.oneOf(['Python', 'Lilypond', 'MEI']).isRequired,
        initialValue: React.PropTypes.string,  // initial value for the editor
        submitFunction: React.PropTypes.func.isRequired,
    },
    getDefaultProps() {
        return {
            initialValue: '',
        };
    },
    getInitialState() {
        return {
            editorValue: this.props.initialValue || '',
        };
    },
    componentWillReceiveProps(nextProps) {
        if (this.props.initialValue === '' && this.props.initialValue !== nextProps.initialValue) {
            this.setState({ editorValue: nextProps.initialValue });
        }
    },
    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.initialValue === '' && this.props.initialValue !== nextProps.initialValue) {
            return true;
        }
        return nextState.editorValue !== this.state.editorValue;
    },
    handleEditorChange(withThis) {
        this.setState({ editorValue: withThis });
    },
    handleSubmit() {
        if (this.props.codeLanguage === 'Lilypond') {
            this.props.submitFunction(this.state.editorValue, 'lilypond');
        } else {
            this.props.submitFunction(this.state.editorValue);
        }
    },
    render() {
        return (
            <div className="codemode-wrapper">
                <div className="nc-codemode-toolbar nc-toolbar">
                    <SubmitCodeButton
                        hoverText={`Submit  ${this.props.codeLanguage}`}
                        codeLanguage={this.props.codeLanguage.toLowerCase()}
                        onClick={() => this.handleSubmit()}
                        displayText={`Submit  ${this.props.codeLanguage}`}
                    />
                </div>
                <div className="nc-content-wrap nc-codemode-editor">
                    <CodeMirror
                        onChange={this.handleEditorChange}
                        text={this.state.editorValue}
                    />
                </div>
            </div>
        );
    },
});


const SubmitCodeButton = React.createClass({
    propTypes: {
        amSize: React.PropTypes.oneOf(['xl', 'lg', 'default', 'sm', 'xs']),
        amStyle: React.PropTypes.oneOf([
            'default', 'primary', 'secondary', 'success', 'warning', 'danger', 'link',
        ]),
        codeLanguage: React.PropTypes.oneOf(['python', 'lilypond', 'mei']).isRequired,
        displayText: React.PropTypes.string,
        hoverText: React.PropTypes.string,
        logo: React.PropTypes.bool,
        onClick: React.PropTypes.func.isRequired,
    },
    getDefaultProps() {
        return {
            amSize: 'sm',
            amStyle: 'link',
            displayText: '',
            hoverText: '',
            logo: true,
        };
    },
    render() {
        let logo = null;
        if (this.props.logo) {
            logo = <Icon type={this.props.codeLanguage} />;
        }
        return (
            <Button
                className="nc-code-btn"
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

export default CodeMode;
