// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/code_mode.js
// Purpose:                React components for individual code modes in CodeView.
//
// Copyright (C) 2017 Sienna M. Wood
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

import { Button } from 'amazeui-react';
import CodeMirror from 'react-codemirror';
import React from 'react';

require('codemirror/mode/python/python');
require('codemirror/mode/xml/xml');  // for MEI
require('codemirror/mode/stex/stex');  // for LilyPond
require('codemirror/addon/edit/matchbrackets');
require('codemirror/addon/edit/closetag');

import {
    LANGUAGES,
    LANGUAGES_PROPTYPE,
} from '../constants';
import { Icon } from './svg_icons';


class CodeMode extends React.Component {

    constructor(props) {
        super(props);
        this.handleEditorChange = this.handleEditorChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.refReceiver = this.refReceiver.bind(this);
        this.state = {
            editorValue: this.props.initialValue || '',
            focused: false,
        };
    }

    componentDidMount() {
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

    handleExtraKey() {
        if (this.state.focused) {
            this.handleSubmit();
        }
    }

    handleEditorChange(withThis) {
        this.setState({ editorValue: withThis });
    }

    handleSubmit() {
        this.props.submitFunction(this.state.editorValue);
    }

    refReceiver(ref) {
        if (ref) {
            this.textInput = ref;
        } else {
            this.textInput = undefined;
        }
    }

    render() {
        let title = 'Submit';
        let mode = 'python';

        switch (this.props.codeLanguage) {
        case LANGUAGES.LILYPOND:
            title = 'Submit LilyPond';
            mode = 'stex';
            break;
        case LANGUAGES.PYTHON:
            title = 'Run Python';
            mode = 'python';
            break;
        case LANGUAGES.MEI:
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
            matchBrackets: true,
            autoCloseTags: true,
            extraKeys: {
                'Shift-Enter': this.handleExtraKey.bind(this),
            },
        };

        return (
            <div className="codemode-wrapper" onFocus={this.onFocus} onBlur={this.onBlur}>
                <div className="nc-codemode-toolbar nc-toolbar">
                    <SubmitCodeButton
                        codeLanguage={this.props.codeLanguage}
                        hoverText={title}
                        onClick={this.handleSubmit}
                    >
                        {title}
                    </SubmitCodeButton>
                    <SubmitCodeButton
                        codeLanguage={this.props.codeLanguage}
                        hide={this.props.codeLanguage !== LANGUAGES.LILYPOND}
                        hoverText="Render LilyPond document to the PDF tab."
                        onClick={this.props.renderPDF}
                    >
                        {'Render to PDF'}
                    </SubmitCodeButton>
                </div>
                <div className="nc-content-wrap nc-codemode-editor">
                    <CodeMirror
                        ref={this.refReceiver}
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
    codeLanguage: LANGUAGES_PROPTYPE.isRequired,
    initialValue: React.PropTypes.string,  // initial value for the editor
    submitFunction: React.PropTypes.func.isRequired,
    active: React.PropTypes.bool.isRequired, // is parent tab active?
    renderPDF: React.PropTypes.func,
};
CodeMode.defaultProps = {
    initialValue: '',
    renderPDF: () => {},
};


function SubmitCodeButton(props) {
    if (props.hide) {
        return null;
    }

    let logo = null;

    if (props.logo) {
        let logoType = '';
        switch (props.codeLanguage) {
        case LANGUAGES.LILYPOND:
            logoType = 'lilypond';
            break;
        case LANGUAGES.MEI:
            logoType = 'mei';
            break;
        default:
            logoType = 'python';
            break;
        }

        logo = <Icon type={logoType} />;
    }

    return (
        <Button
            className="nc-code-btn"
            title={props.hoverText}
            amSize={props.amSize}
            amStyle={props.amStyle}
            onClick={props.onClick}
        >
            {logo}{props.children}
        </Button>
    );
}
SubmitCodeButton.propTypes = {
    amSize: React.PropTypes.oneOf(['xl', 'lg', 'default', 'sm', 'xs']),
    amStyle: React.PropTypes.oneOf([
        'default', 'primary', 'secondary', 'success', 'warning', 'danger', 'link',
    ]),
    children: React.PropTypes.string.isRequired,
    codeLanguage: LANGUAGES_PROPTYPE.isRequired,
    hide: React.PropTypes.bool,
    hoverText: React.PropTypes.string,
    logo: React.PropTypes.bool,
    onClick: React.PropTypes.func.isRequired,
};
SubmitCodeButton.defaultProps = {
    amSize: 'sm',
    amStyle: 'link',
    hide: false,
    hoverText: '',
    logo: true,
};


export default CodeMode;
