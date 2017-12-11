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

/* NOTE to my future self:
 * The data flow is convoluted. Here's (approximately) what (I think) happens:
 * - The "editorValue" prop of <CodeModeLilypondUnwrapped> is the only textual
 *   content sent on to <CodeEditorWithToolbar>.
 * - The "editorValue" comes from the "text_editors" store.
 * - The "text_editors" store first knows about the editor's value because of
 *   the call to editorActions.setEditorContent() in this component's
 *   componentWillReceiveProps().
 * - This component knows what the editor's contents should be because of the
 *   "initialValue" prop passed down by its parent.
 * - The "initialValue" comes from the "lilypond" store, where Lychee (incorrectly)
 *   provides only the text-editor-ready view and it is stored (incorrectly) by
 *   Julius as the "latest" view in the store.
 * - And this component's componentWillReceiveProps() will only set
 *   the "text_editors" store when the "initialValue" prop happens to have been
 *   an empty string before it was provided with another value (presumably after
 *   being given the new value by Lychee). If the "initialValue" prop is not
 *   an empty string to start with, then I believe the text editor in the
 *   interface will never be given any text to display.
 * - And before you start thinking that it's okay for the text editor component
 *   to be primarily responsible for determining what's in the text editor store,
 *   that's wrong. Functional reactive programming is about having the store do
 *   all the thinking. If the text editor is connected to the store, then the
 *   component tells the store when it's changed, the store updates its state,
 *   and only *then* can the React component change its view.
 *
 * Yikes-fully yours,
 * Christopher.
 */

import React from 'react';
import { connect } from 'react-redux';

import { actions as fujianActions } from '../stores/fujian';
import { getters as editorGetters, actions as editorActions } from '../stores/text_editors';

import CodeEditorWithToolbar from './code_editor_with_toolbar';
import SubmitCodeButton from './submit_code_button';


class CodeModeLilypondUnwrapped extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        // NOTE: Don't change this function without reading the note above.
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
