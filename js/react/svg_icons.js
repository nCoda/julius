// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/svg_icons.js
// Purpose:                SVG icon handler for nCoda.
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
// ------------------------------------------------------------------------------------------------

import React from "react";

export const IconPython = React.createClass({
    getDefaultProps() {
        return {
            width: '200',
            height: '200',
            iconfill: '#000',
        };
    },
    render() {
        return (
            <svg className="icon-python" xmlns="http://www.w3.org/2000/svg" width={this.props.width}
                 height={this.props.height} viewBox="0 0 512 512" aria-labelledby="title">
                <title id="title">Python Icon</title>
                <path fill={this.props.iconfill} d="M253.806 1.783c-20.678.098-40.426 1.86-57.803 4.935-51.187 9.044-60.48 27.97-60.48 62.877v46.103h120.963v15.366H90.126c-35.155 0-65.937 21.13-75.563 61.325-11.107 46.07-11.603 74.83 0 122.932 8.6 35.808 29.13 61.324 64.286 61.324h41.582v-55.27c0-39.92 34.544-75.14 75.564-75.14H316.82c33.632 0 60.48-27.69 60.48-61.468V69.59c0-32.774-27.654-57.404-60.48-62.875-20.78-3.46-42.34-5.033-63.018-4.934zM188.39 38.86c12.495 0 22.7 10.37 22.7 23.12 0 12.705-10.205 22.982-22.7 22.982-12.54 0-22.698-10.277-22.698-22.982 0-12.75 10.157-23.12 22.7-23.12z"/>
                <path fill={this.props.iconfill} d="M392.387 131.062v53.712c0 41.648-35.303 76.692-75.562 76.692H196.002c-33.094 0-60.48 28.327-60.48 61.47V438.12c0 32.778 28.503 52.064 60.48 61.464 38.29 11.26 75.004 13.3 120.822 0 30.45-8.812 60.48-26.56 60.48-61.463v-46.1h-120.82v-15.36h181.298c35.156 0 48.26-24.52 60.48-61.324 12.63-37.896 12.094-74.336 0-122.94-8.686-34.993-25.28-61.325-60.48-61.325h-45.395zm-67.95 291.688c12.54 0 22.7 10.27 22.7 22.975 0 12.75-10.16 23.124-22.7 23.124-12.492 0-22.695-10.38-22.695-23.13 0-12.707 10.202-22.976 22.696-22.976z"/>
            </svg>
        )
    }
});


export const IconLilypond = React.createClass({
    getDefaultProps() {
        return {
            width: '200',
            height: '200',
            iconfill: '#000',
        };
    },
    render() {
        return (
            <svg className="icon-lilypond" xmlns="http://www.w3.org/2000/svg" width={this.props.width}
                 height={this.props.height} viewBox="0 0 512 512" aria-labelledby="title">
                <title id="title">Lilypond Icon</title>
                <path fill={this.props.iconfill} d="M312.744 5.5C205.467 5.5 118.5 73.55 118.5 157.5c0 6.15.467 12.215 1.375 18.175 31.302-11.89 65.975-18.175 101.875-18.175 61.142 0 118.73 18.23 162.156 51.334 21.38 16.297 38.197 35.336 49.99 56.59 1.5 2.703 2.91 5.428 4.23 8.172 42.116-27.882 68.862-69.548 68.862-116.098C506.988 73.55 420.023 5.5 312.744 5.5"/>
                <path fill={this.props.iconfill} d="M121.834 185.684C50.128 213.478 1 270.254 1 335.777c0 92.94 98.833 168.28 220.75 168.28 37.227 0 72.296-7.03 103.062-19.44l-23.56-99.298 80.72 66.21c37.512-30.164 60.527-70.91 60.527-115.754 0-19.95-4.554-39.085-12.913-56.842-32.516 19.188-72.98 30.563-116.845 30.563-32.76 0-63.613-6.355-90.688-17.56l20.73-89.692-71.027 59.804c-25.158-20.766-42.907-47.086-49.924-76.367M221.75 167.5c-35.963 0-69.915 6.554-99.917 18.184 7.017 29.282 24.766 55.6 49.925 76.367l71.027-59.802-20.73 89.69c27.075 11.206 57.93 17.562 90.688 17.562 43.864 0 84.33-11.376 116.845-30.564C399.008 213.97 317.496 167.5 221.75 167.5"/>
            </svg>
        )
    }
});

