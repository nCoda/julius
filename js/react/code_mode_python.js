// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/code_mode_lilypond.js
// Purpose:                React component for Python code mode in CodeView.
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

import CodeEditorWithToolbar from './generics/code_editor_with_toolbar';
import SubmitCodeButton from './submit_code_button';

import { connect } from 'react-redux';
import { getters as editorGetters } from '../stores/text_editors';

class CodeModePythonUnwrapped extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setEditorValue = this.setEditorValue.bind(this);
    }

    setEditorValue(editorValue) {
        this.setState({ editorValue });
    }

    handleSubmit() {
        this.props.submitFunction(this.props.editorValue);
    }

    render() {
        return (
            <CodeEditorWithToolbar
                active={this.props.active}
                editorMode="python"
                editorName="python"
                submitFunction={this.handleSubmit}
                setEditorValue={this.setEditorValue}
                editorValue={this.props.editorValue}
            >
                <SubmitCodeButton
                    hoverText="Run Python"
                    codeLanguage="python"
                    onClick={this.handleSubmit}
                >
                    {'Run Python'}
                </SubmitCodeButton>
            </CodeEditorWithToolbar>
        );
    }
}
CodeModePythonUnwrapped.propTypes = {
    editorValue: React.PropTypes.string,  // text contents of editor
    submitFunction: React.PropTypes.func.isRequired, // to submit code to Lychee
    active: React.PropTypes.bool.isRequired, // is parent tab active?
};
CodeModePythonUnwrapped.defaultProps = {
    editorValue: '',
};

const CodeModePython = connect(state => ({
    editorValue: editorGetters.current(state, 'python'),
}))(CodeModePythonUnwrapped);

export default CodeModePython;
