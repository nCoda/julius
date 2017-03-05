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

import CodeMirror from 'react-codemirror';

require('codemirror/mode/python/python');
require('codemirror/mode/xml/xml');
// require('../lib/lilypond_codemirror'); custom syntax highlighting currently in development

import { Button } from 'amazeui-react';
import { Icon } from './svg_icons';

class CodeMode extends React.Component {
    constructor(props) {
        super(props);
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleEditorChange = this.handleEditorChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            editorValue: this.props.initialValue || '',
            focused: false,
        };
    }
    componentDidMount() {
        window.addEventListener('keyup', this.handleKeyUp, true);
        window.addEventListener('keydown', this.handleKeyDown, true);
        this.pullFocus();
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.initialValue === '' && this.props.initialValue !== nextProps.initialValue) {
            this.setState({ editorValue: nextProps.initialValue });
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.initialValue === '' && this.props.initialValue !== nextProps.initialValue) {
            return true;
        }
        if (this.props.active !== nextProps.active) {
            return true;
        }
        return nextState.editorValue !== this.state.editorValue;
    }
    componentDidUpdate() {
        this.pullFocus();
    }
    componentWillUnmount() {
        window.removeEventListener('keyup', this.handleKeyUp, true);
        window.removeEventListener('keydown', this.handleKeyDown, true);
    }
    onBlur() {
        this.setState({ focused: false });
    }
    onFocus() {
        this.setState({ focused: true });
    }
    pullFocus() {
        if (this.props.active) {
            this.textInput.getCodeMirror().focus();
            this.onFocus();
        }
    }
    handleKeyUp(e) {
        if (this.state.focused && e.code === 'Enter' && e.shiftKey) {
            e.preventDefault();
            this.handleSubmit();
        }
    }
    handleKeyDown(e) { // prevent default behavior on keydown for shift-enter, to allow keyup submit
        if (this.state.focused && e.code === 'Enter' && e.shiftKey) {
            e.preventDefault();
        }
    }
    handleEditorChange(withThis) {
        this.setState({ editorValue: withThis });
    }
    handleSubmit() {
        if (this.props.codeLanguage === 'Lilypond') {
            this.props.submitFunction(this.state.editorValue, 'lilypond');
        } else {
            this.props.submitFunction(this.state.editorValue);
        }
    }
    render() {
        let title;
        let mode;

        switch (this.props.codeLanguage) {
        case 'lilypond':
            title = 'Submit LilyPond';
            mode = 'lilypond';
            break;
        case 'python':
            title = 'Run Python';
            mode = 'python';
            break;
        case 'mei':
            title = 'Submit MEI';
            mode = 'xml';
            break;
        default:
            title = 'Submit';
            mode = 'python';
        }

        const options = {
            mode,
            lineNumbers: true,
            autofocus: false,
            electricChars: true,
            indentUnit: 4,
            indentWithTabs: false,
            lineWrapping: false,
            smartIndent: true,
            theme: 'codemirror-ncoda light',
        };

        return (
            <div className="codemode-wrapper" onFocus={this.onFocus} onBlur={this.onBlur}>
                <div className="nc-codemode-toolbar nc-toolbar">
                    <SubmitCodeButton
                        hoverText={title}
                        codeLanguage={this.props.codeLanguage.toLowerCase()}
                        onClick={() => this.handleSubmit()}
                    >
                        {title}
                    </SubmitCodeButton>
                </div>
                <div className="nc-content-wrap nc-codemode-editor">
                    <CodeMirror
                        ref={input => this.textInput = input}
                        onChange={this.handleEditorChange}
                        value={this.state.editorValue}
                        options={options}
                    />
                </div>
            </div>
        );
    }
}
CodeMode.propTypes = {
    codeLanguage: React.PropTypes.oneOf(['python', 'lilypond', 'mei']).isRequired,
    initialValue: React.PropTypes.string,  // initial value for the editor
    submitFunction: React.PropTypes.func.isRequired,
    active: React.PropTypes.bool.isRequired, // is parent tab active?
};
CodeMode.defaultProps = {
    initialValue: '',
};

class SubmitCodeButton extends React.Component {
    constructor(props) {
        super(props);
    }
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
                {logo}{this.props.children}
            </Button>
        );
    }
}
SubmitCodeButton.PropTypes = {
    amSize: React.PropTypes.oneOf(['xl', 'lg', 'default', 'sm', 'xs']),
    amStyle: React.PropTypes.oneOf([
        'default', 'primary', 'secondary', 'success', 'warning', 'danger', 'link',
    ]),
    children: React.PropTypes.string.isRequired,
    codeLanguage: React.PropTypes.oneOf(['python', 'lilypond', 'mei']).isRequired,
    hoverText: React.PropTypes.string,
    logo: React.PropTypes.bool,
    onClick: React.PropTypes.func.isRequired,
};
SubmitCodeButton.defaultProps = {
    amSize: 'sm',
    amStyle: 'link',
    displayText: '',
    hoverText: '',
    logo: true,
};


export default CodeMode;
