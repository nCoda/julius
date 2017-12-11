// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/code_mode_lilypond.js
// Purpose:                React component for providing generic code editor with toolbar.
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

import debounce from 'lodash/debounce';

import { actions as editorActions } from '../stores/text_editors';
import { actions as fujianActions } from '../stores/fujian';

import 'codemirror/mode/python/python';
import 'codemirror/mode/stex/stex'; // for LilyPond
import 'codemirror/mode/xml/xml';

import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/matchbrackets';

export default class CodeEditorWithToolbar extends React.Component {
    constructor(props) {
        super(props);
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.pullFocus = this.pullFocus.bind(this);
        this.handleExtraKey = this.handleExtraKey.bind(this);
        this.handleEditorChange = debounce(this.handleEditorChange.bind(this), 300);
        this.setRef = this.setRef.bind(this);
        this.state = {
            focused: false,
        };
    }

    componentDidMount() {
        this.pullFocus();
        editorActions.setEditorContent(this.props.editorValue);
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.editorValue === '' && this.props.editorValue !== nextProps.editorValue) {
            return true;
        }
        return this.props.active !== nextProps.active;
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

    setRef(withThis) {
        this.textInput = withThis;
    }

    pullFocus() {
        if (this.props.active) {
            this.textInput.getCodeMirror().focus();
            this.onFocus();
        }
    }

    handleExtraKey() { // bound in CodeMirror options
        if (this.state.focused && this.props.submitFunction) {
            this.props.submitFunction();
        }
    }

    handleEditorChange(withThis) {
        if (!this.props.editorReadOnly) {
            editorActions.setEditorContent(this.props.editorName, withThis);
            fujianActions.saveTextEditor(this.props.editorName, withThis);
        }
    }

    render() {
        const options = {
            mode: this.props.editorMode,
            readOnly: this.props.editorReadOnly,
            extraKeys: { 'Shift-Enter': this.handleExtraKey },
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
        };

        return (
            <div className="codemode-wrapper" onFocus={this.onFocus} onBlur={this.onBlur}>
                <div className="nc-codemode-toolbar nc-toolbar">
                    {this.props.children}
                </div>
                <div className="nc-content-wrap nc-codemode-editor">
                    <CodeMirror
                        ref={this.setRef}
                        onChange={this.handleEditorChange}
                        value={this.props.editorValue}
                        options={options}
                    />
                </div>
            </div>
        );
    }
}
CodeEditorWithToolbar.propTypes = {
    active: React.PropTypes.bool.isRequired, // is parent tab active?
    editorName: React.PropTypes.oneOf(['python', 'lilypond', 'mei']).isRequired, // name for Redux store
    editorMode: React.PropTypes.oneOf(['python', 'stex', 'xml']), // for code highlighting (stex for Lilypond)
    submitFunction: React.PropTypes.func, // to submit code changes to Lychee
    editorValue: React.PropTypes.string, // text contents of editor
    editorReadOnly: React.PropTypes.bool, // is text editable or read-only?
    children: React.PropTypes.node, // contents of toolbar (buttons, explanatory text...)
};
CodeEditorWithToolbar.defaultProps = {
    editorName: 'other',
    editorMode: 'python',
    submitFunction: () => {},
    editorValue: '',
    editorReadOnly: false,
};
