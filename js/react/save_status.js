// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/save_status.js
// Purpose:                React component to indicate whether the current project is saved,
//                         unsaved, currently saving, or if saving is disabled.
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
import { getters as editorGetters } from '../stores/text_editors';

class SaveStatusUnwrapped extends React.Component {
    render() {
        let message;
        let classes = 'nc-savestatus';

        switch (this.props.currentStatus) {
        case 'saved':
            message = 'All changes saved';
            classes += ' saved';
            break;
        case 'unsaved':
            message = 'Changes not saved';
            classes += ' unsaved';
            break;
        case 'saving':
            message = 'Saving...';
            classes += ' saving';
            break;
        case 'disabled':
        default:
            message = 'Saving disabled';
        }
        return (
            <div className={classes}>
                {message}
            </div>
        );
    }
}
SaveStatusUnwrapped.propTypes = {
    currentStatus: React.PropTypes.oneOf(['saved', 'unsaved', 'saving', 'disabled']),
};

SaveStatusUnwrapped.defaultProps = {
    currentStatus: 'disabled',
};

const SaveStatus = connect((state) => {
    return {
        currentStatus: editorGetters.getSaveStatus(state),
    };
})(SaveStatusUnwrapped);

export default SaveStatus;
