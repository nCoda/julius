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

import CodeEditorWithToolbar from './generics/code_editor_with_toolbar';
import SubmitCodeButton from './submit_code_button';

import { emitters as signals } from '../nuclear/signals';

export default class CodeModeLilypond extends React.Component {
    constructor(props) {
        super(props);
        this.setEditorValue = this.setEditorValue.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmitPDF = this.handleSubmitPDF.bind(this);
        this.state = {
            editorValue: this.props.initialValue,
        };
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

    setEditorValue(editorValue) {
        this.setState({ editorValue });
    }

    handleSubmit() {
        this.props.submitFunction(this.state.editorValue, 'lilypond');
    }

    handleSubmitPDF() {
        signals.submitToLychee(this.state.editorValue, 'lilypond', true);
        signals.doLilyPondPDF();
    }

    render() {
        return (
            <CodeEditorWithToolbar
                active={this.props.active}
                editorMode="stex"
                submitFunction={this.handleSubmit}
                setEditorValue={this.setEditorValue}
                editorValue={this.state.editorValue}
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
                    onClick={this.handleSubmitPDF}
                >
                    {'Render to PDF'}
                </SubmitCodeButton>
            </CodeEditorWithToolbar>
        );
    }
}
CodeModeLilypond.propTypes = {
    initialValue: React.PropTypes.string,  // initial value for the editor
    submitFunction: React.PropTypes.func.isRequired,  // to submit code to Lychee
    active: React.PropTypes.bool.isRequired, // is parent tab active?
};
CodeModeLilypond.defaultProps = {
    initialValue: '',
};
