// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/code_mode_lilypond.js
// Purpose:                React component for read-only MEI code mode in CodeView.
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

import CodeEditorWithToolbar from './code_editor_with_toolbar';

import { connect } from 'react-redux';
import { getters as vrvGetters } from '../stores/verovio';

const CodeModeMEIUnwrapped = ({ active, editorValue }) => (
    <CodeEditorWithToolbar
        active={active}
        editorMode="xml"
        editorName="mei"
        editorValue={editorValue}
        editorReadOnly
    >
        {'Content cannot be edited'}
    </CodeEditorWithToolbar>
);
CodeModeMEIUnwrapped.propTypes = {
    active: React.PropTypes.bool.isRequired, // is parent tab active?
    editorValue: React.PropTypes.string, // text contents of editor
};
CodeModeMEIUnwrapped.defaultProps = {
    editorValue: '',
};

const CodeModeMEI = connect(state => ({
    editorValue: vrvGetters.current(state),
}))(CodeModeMEIUnwrapped);

export default CodeModeMEI;
