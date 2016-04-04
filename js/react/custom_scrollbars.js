// -*- coding: utf-8 -*-
//-------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/custom_scrollbars.js
// Purpose:                Customization of react-custom-scrollbars
//
// Copyright (C) 2016 Sienna M. Wood
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
//-------------------------------------------------------------------------------------------------


import React, { createClass, PropTypes } from 'react';
import { Scrollbars } from '../../node_modules/react-custom-scrollbars';

export default createClass({

    displayName: 'CustomScrollbars',

    propTypes: {
        style: PropTypes.object
    },


    renderThumbV({ style, ...props }) {  // vertical thumb
        const thumbStyle = {
            transparency: '.7',
            backgroundColor: '#FFFFFF',
            border: 'solid #000000 1px',
            borderRadius: '5px',
            width: '15px'
        };
        return (
            <div
                style={{ ...style, ...thumbStyle }}
                {...props}></div>
        );
    },

    renderThumbH({ style, ...props }) {  // horizontal thumb
        const thumbStyle = {
            transparency: '.7',
            backgroundColor: '#FFFFFF',
            border: 'solid #000000 1px',
            borderRadius: '5px',
            height: '15px'
        };
        return (
            <div
                style={{ ...style, ...thumbStyle }}
                {...props}></div>
        );
    },

    render() {
        const { style } = this.props;
        const containerStyle = {
            ...style,
            position: 'absolute',
            width: '100%',
            height: '100%'
        };

        return (
            <div className="custom-scrollbars-container" style={containerStyle}>
                <Scrollbars
                    className="custom-scrollbars"
                    ref="scrollbars"
                    renderThumbHorizontal={this.renderThumbH}
                    renderThumbVertical={this.renderThumbV}
                    {...this.props}/>
            </div>
        );
    }
});
