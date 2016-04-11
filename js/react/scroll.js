// -*- coding: utf-8 -*-
//-------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/scroll.js
// Purpose:                Wrapper for scroll areas (native scrollbars)
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


// Entirely fills parent element with scrollable region.
// Padding on .scroll-container used to accommodate absolutely-positioned headings (see css/ncoda/split_panes.less).
// Extra classes can be passed to outer .scroll-container with extraClass property:
// <Scroll extraClass="myextraclass">...</Scroll>


import React from 'react';

const  Scroll = React.createClass({

    propTypes: {
        position: React.PropTypes.string,
        width: React.PropTypes.string,
        height: React.PropTypes.string,
        overflow: React.PropTypes.string,
        extraClass: React.PropTypes.string
    },
    getDefaultProps() {
        return {
            extraClass: ''
        };
    },

    render() {
        const containerStyle = {
            position: 'absolute',
            width: '100%',
            height: '100%',
            overflow: 'hidden'
        };
        const scrollAreaStyle = {
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'auto'
        };

        let className = 'scroll-container ';
        if (this.props.extraClass !== '') {
            className += `${className} ${this.props.extraClass}`;
        }

        return (
            <div className={className} style={containerStyle}>
                <div className="scroll-area" style={scrollAreaStyle}>
                    {this.props.children}
                </div>
            </div>
        );
    }
});

export default Scroll;
