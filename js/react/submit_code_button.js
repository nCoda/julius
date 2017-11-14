// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/submit_code_button.js
// Purpose:                React button for submitting code for code modes in CodeView.
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
import { Icon } from './svg_icons';

const SubmitCodeButton = (props) => {
    let logo = null;
    if (props.logo) {
        logo = <Icon type={props.codeLanguage} />;
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

};
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

export default SubmitCodeButton;
