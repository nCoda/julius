// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/code_mode_lilypond.js
// Purpose:                React component for Lilypond code mode in CodeView.
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
import { connect } from 'react-redux';

import { actions as fujianActions } from '../stores/fujian';
import { getters as editorGetters, actions as editorActions } from '../stores/text_editors';

import CodeEditorWithToolbar from './generics/code_editor_with_toolbar';
import SubmitCodeButton from './submit_code_button';


class CodeModeLilypondUnwrapped extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.initialValue === '' && this.props.initialValue !== nextProps.initialValue) {
            editorActions.setEditorContent('lilypond', nextProps.initialValue);
        }
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.initialValue === '' && this.props.initialValue !== nextProps.initialValue) {
            return true;
        }
        if (this.props.active !== nextProps.active) {
            return true;
        }
        return nextProps.editorValue !== this.props.editorValue;
    }

    handleSubmit() {
        this.props.submitFunction(this.props.editorValue, 'lilypond');
        fujianActions.saveTextEditor('lilypond', this.props.editorValue);
    }

    render() {
        return (
            <CodeEditorWithToolbar
                active={this.props.active}
                editorMode="stex"
                editorName="lilypond"
                submitFunction={this.handleSubmit}
                editorValue={this.props.editorValue}
            >
                <SubmitCodeButton
                    hoverText="Submit Lilypond"
                    codeLanguage="lilypond"
                    onClick={this.handleSubmit}
                >
                    {'Submit Lilypond'}
                </SubmitCodeButton>
                <SubmitCodeButton
                    hoverText="Render LilyPond document to the PDF tab."
                    codeLanguage="lilypond"
                    onClick={this.props.renderPDF}
                >
                    {'Render to PDF'}
                </SubmitCodeButton>
            </CodeEditorWithToolbar>
        );
    }
}
CodeModeLilypondUnwrapped.propTypes = {
    editorValue: React.PropTypes.string,  // text contents of editor
    initialValue: React.PropTypes.string,  // initial value for the editor
    submitFunction: React.PropTypes.func.isRequired,  // to submit code to Lychee
    active: React.PropTypes.bool.isRequired, // is parent tab active?
    renderPDF: React.PropTypes.func,
};
CodeModeLilypondUnwrapped.defaultProps = {
    editorValue: '',
    initialValue: '',
    renderPDF: () => {},
};

const CodeModeLilypond = connect(state => ({
    editorValue: editorGetters.current(state, 'lilypond'),
}))(CodeModeLilypondUnwrapped);

export default CodeModeLilypond;
