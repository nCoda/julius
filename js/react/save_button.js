// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/save_button.js
// Purpose:                Save button for CodeScoreView.
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
import { Button } from 'amazeui-react';

import { connect } from 'react-redux';
import { getters as editorGetters } from '../stores/text_editors';


class SaveButtonUnwrapped extends React.Component {

    constructor(props) {
        super(props);

        this.handleSave = this.handleSave.bind(this);
    }

    handleSave() {
        this.props.editorList.forEach((editor) => {
            console.log(`${editor.name}: ${editor.content}`);
        });
    }

    render() {
        return (
            <Button
                amSize="sm"
                amStyle="link"
                title="Save Project"
                className="nc-save-btn"
                onClick={this.handleSave}
            >
                <i className="am-icon-save" /> Save Project
            </Button>
        );
    }
}

SaveButtonUnwrapped.propTypes = {
    // text contents of code editors
    editorList: React.PropTypes.arrayOf(React.PropTypes.shape({
        name: React.PropTypes.string,
        content: React.PropTypes.string,
    })),
};

SaveButtonUnwrapped.defaultProps = {
    editorList: {},
};

const SaveButton = connect(state => ({
    editorList: editorGetters.all(state),
}))(SaveButtonUnwrapped);

export default SaveButton;
