// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/svg_icons.js
// Purpose:                SVG icon handler for nCoda.
//
// Copyright (C) 2016, 2017 Sienna M. Wood
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

export const Icon = React.createClass({
    propTypes: {
        fill: React.PropTypes.string,
        type: React.PropTypes.oneOf(['python', 'lilypond', 'coda']),  // 'coda' is default
    },
    getDefaultProps() {
        return {
            fill: '#000',
        };
    },
    render() {
        const classes = `nc-svg-icon icon-${ this.props.type.toLowerCase()}`;
        let viewBoxDef = "0 0 512 512";
        let icon;
        const iconName = this.props.type.toLowerCase();
        if (iconName === 'python') {
            icon = [
                (<path key={1} fill={this.props.fill} d="M253.806 1.783c-20.678.098-40.426 1.86-57.803 4.935-51.187 9.044-60.48 27.97-60.48 62.877v46.103h120.963v15.366H90.126c-35.155 0-65.937 21.13-75.563 61.325-11.107 46.07-11.603 74.83 0 122.932 8.6 35.808 29.13 61.324 64.286 61.324h41.582v-55.27c0-39.92 34.544-75.14 75.564-75.14H316.82c33.632 0 60.48-27.69 60.48-61.468V69.59c0-32.774-27.654-57.404-60.48-62.875-20.78-3.46-42.34-5.033-63.018-4.934zM188.39 38.86c12.495 0 22.7 10.37 22.7 23.12 0 12.705-10.205 22.982-22.7 22.982-12.54 0-22.698-10.277-22.698-22.982 0-12.75 10.157-23.12 22.7-23.12z"/>),
                (<path key={2} fill={this.props.fill} d="M392.387 131.062v53.712c0 41.648-35.303 76.692-75.562 76.692H196.002c-33.094 0-60.48 28.327-60.48 61.47V438.12c0 32.778 28.503 52.064 60.48 61.464 38.29 11.26 75.004 13.3 120.822 0 30.45-8.812 60.48-26.56 60.48-61.463v-46.1h-120.82v-15.36h181.298c35.156 0 48.26-24.52 60.48-61.324 12.63-37.896 12.094-74.336 0-122.94-8.686-34.993-25.28-61.325-60.48-61.325h-45.395zm-67.95 291.688c12.54 0 22.7 10.27 22.7 22.975 0 12.75-10.16 23.124-22.7 23.124-12.492 0-22.695-10.38-22.695-23.13 0-12.707 10.202-22.976 22.696-22.976z"/>),
            ];
        }
        else if (iconName === 'lilypond') {
            icon = [
                (<path key={1} fill={this.props.fill} d="M312.744 5.5C205.467 5.5 118.5 73.55 118.5 157.5c0 6.15.467 12.215 1.375 18.175 31.302-11.89 65.975-18.175 101.875-18.175 61.142 0 118.73 18.23 162.156 51.334 21.38 16.297 38.197 35.336 49.99 56.59 1.5 2.703 2.91 5.428 4.23 8.172 42.116-27.882 68.862-69.548 68.862-116.098C506.988 73.55 420.023 5.5 312.744 5.5"/>),
                (<path key={2} fill={this.props.fill} d="M121.834 185.684C50.128 213.478 1 270.254 1 335.777c0 92.94 98.833 168.28 220.75 168.28 37.227 0 72.296-7.03 103.062-19.44l-23.56-99.298 80.72 66.21c37.512-30.164 60.527-70.91 60.527-115.754 0-19.95-4.554-39.085-12.913-56.842-32.516 19.188-72.98 30.563-116.845 30.563-32.76 0-63.613-6.355-90.688-17.56l20.73-89.692-71.027 59.804c-25.158-20.766-42.907-47.086-49.924-76.367M221.75 167.5c-35.963 0-69.915 6.554-99.917 18.184 7.017 29.282 24.766 55.6 49.925 76.367l71.027-59.802-20.73 89.69c27.075 11.206 57.93 17.562 90.688 17.562 43.864 0 84.33-11.376 116.845-30.564C399.008 213.97 317.496 167.5 221.75 167.5"/>),
            ];
        }
        else { // default is 'coda'
            viewBoxDef = "0 0 200 200";
            icon = (
                <path fill={this.props.fill} d="M158.867 103.242c-.393 1.867-1.3 3.326-3.312 2.9l-17.094-3.603c-7.1 26.56-31.813 44.156-55.48 41.118l-4.238 20.112c-.424 2.012-2.125 2.252-3.993 1.858-1.868-.396-3.328-1.302-2.903-3.312l4.24-20.112c-22.88-6.772-38.245-32.817-34.163-60.014L22.96 78.196c-2.01-.424-2.252-2.125-1.86-3.992.395-1.868 1.302-3.327 3.313-2.903L43.376 75.3c7.303-26.82 31.812-44.158 55.48-41.12l3.904-18.532c.394-1.867 2.095-2.11 3.962-1.715s3.326 1.303 2.934 3.17l-3.906 18.532c22.88 6.773 38.418 32.704 34.164 60.015l17.094 3.604c2.012.423 2.254 2.124 1.86 3.992zm-91.07-22.797l20.4 4.3 8.963-42.522c-20.763-2.576-24.457 14.95-29.362 38.222zm9.742 54.867l9.204-43.672-20.4-4.3c-4.518 22.154-6.883 41.91 11.195 47.972zm26.515-91.635l-8.963 42.52 21.117 4.453c4.905-23.273 7.595-41.01-12.155-46.973zm10.7 53.868l-21.116-4.45-9.206 43.67c18.412 1.63 25.26-17.33 30.322-39.22z"/>
            );
        }

        const iconTitle = `${iconName } icon`;

        return (
            <svg className={classes}
                xmlns="http://www.w3.org/2000/svg"
                viewBox={viewBoxDef}
                aria-labelledby="title"
            >
                <title id="title">{iconTitle}</title>
                {icon}
            </svg>
        );
    },
});

export const Logo = React.createClass({
    propTypes: {
        codafill: React.PropTypes.string,
        textfill: React.PropTypes.string,
    },
    getDefaultProps() {
        return {
            textfill: '#444444', // for dark backgrounds, use #fbfbfb
            codafill: '#50C878',
        };
    },
    render() {
        return (
            <svg className="nc-svg-icon icon-logo"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 588 172"
                aria-labelledby="title"
            >
                <title id="title">{'nCoda Logo'}</title>
                <path fill={this.props.textfill}
                    d="M239.766 67.577c3.888 4.13 5.832 9.792 5.832 16.992V139H232.35V86.44c0-5.376-1.008-9.167-3.024-11.376-2.016-2.208-4.993-3.312-8.928-3.312-4.032 0-7.585 1.152-10.656 3.456-3.073 2.304-5.954 5.616-8.64 9.936V139h-13.248V63.113h11.376l1.152 11.23c2.687-4.03 6.023-7.2 10.008-9.503 3.983-2.304 8.375-3.456 13.176-3.456 6.912 0 12.312 2.066 16.2 6.193zM322.71 40.36c4.08 1.537 8.23 4.032 12.456 7.488l-7.488 8.784c-6.05-4.896-12.434-7.344-19.152-7.344-8.258 0-14.904 3.168-19.944 9.504s-7.56 16.513-7.56 30.528c0 13.633 2.496 23.688 7.488 30.168 4.99 6.48 11.614 9.72 19.872 9.72 4.224 0 7.87-.72 10.944-2.16 3.07-1.44 6.43-3.503 10.08-6.19l6.91 8.782c-2.976 3.168-6.89 5.81-11.734 7.92-4.85 2.11-10.393 3.168-16.633 3.168-8.064 0-15.242-1.99-21.53-5.976-6.288-3.982-11.184-9.84-14.687-17.568-3.505-7.727-5.256-17.014-5.256-27.863 0-10.847 1.823-20.135 5.472-27.863 3.646-7.727 8.59-13.56 14.83-17.496 6.24-3.935 13.2-5.903 20.88-5.903 5.953 0 10.968.77 15.05 2.304zM404.79 72.04c5.903 7.106 8.856 16.755 8.856 28.945 0 7.872-1.346 14.81-4.033 20.808-2.688 6-6.576 10.656-11.664 13.968-5.09 3.313-11.138 4.97-18.145 4.97-10.655 0-18.96-3.55-24.91-10.656-5.955-7.104-8.93-16.752-8.93-28.944 0-7.87 1.343-14.808 4.032-20.808 2.686-6 6.574-10.656 11.664-13.97 5.088-3.31 11.183-4.967 18.288-4.967 10.657 0 18.938 3.552 24.842 10.656zm-44.568 29.088c0 19.296 6.527 28.944 19.584 28.944 13.055 0 19.584-9.695 19.584-29.088 0-19.296-6.48-28.944-19.44-28.944-13.153 0-19.728 9.698-19.728 29.088zM494.286 139h-11.664l-1.296-10.512c-2.498 3.84-5.616 6.84-9.36 9-3.743 2.16-7.92 3.24-12.528 3.24-9.024 0-16.056-3.55-21.096-10.656-5.04-7.104-7.56-16.654-7.56-28.656 0-7.776 1.2-14.688 3.6-20.736 2.398-6.048 5.854-10.775 10.368-14.184 4.512-3.406 9.792-5.112 15.84-5.112 7.776 0 14.592 3.12 20.448 9.36V31l13.248 1.584V139zm-21.6-11.59c2.88-1.873 5.664-4.682 8.353-8.425V81.833c-2.498-3.263-5.162-5.735-7.993-7.416-2.833-1.68-6.025-2.52-9.575-2.52-5.857 0-10.394 2.447-13.61 7.344-3.216 4.897-4.822 12.193-4.822 21.89 0 9.79 1.487 17.088 4.464 21.887 2.975 4.802 7.247 7.2 12.816 7.2 4.03 0 7.487-.936 10.366-2.808zM574.35 128.128c1.055 1.49 2.64 2.617 4.752 3.384l-3.025 9.216c-3.938-.48-7.105-1.584-9.504-3.312-2.4-1.728-4.176-4.414-5.328-8.064-5.09 7.585-12.624 11.376-22.607 11.376-7.488 0-13.393-2.11-17.712-6.336-4.32-4.223-6.48-9.742-6.48-16.56 0-8.064 2.903-14.256 8.712-18.576 5.808-4.32 14.04-6.48 24.697-6.48h11.663v-5.615c0-5.374-1.296-9.215-3.888-11.52-2.592-2.304-6.576-3.456-11.952-3.456-5.57 0-12.384 1.346-20.448 4.032l-3.312-9.647c9.407-3.457 18.144-5.186 26.208-5.186 8.928 0 15.6 2.185 20.016 6.552 4.414 4.37 6.624 10.584 6.624 18.648v34.704c0 3.074.525 5.353 1.583 6.84zm-14.833-9.143V101.56h-9.936c-14.017 0-21.023 5.185-21.023 15.553 0 4.514 1.103 7.92 3.312 10.224 2.206 2.304 5.47 3.456 9.79 3.456 7.583 0 13.537-3.936 17.857-11.808z"
                />
                <path fill={this.props.codafill}
                    d="M147.924 99.472c-.393 1.867-1.3 3.326-3.312 2.9l-17.094-3.603c-7.1 26.56-31.814 44.156-55.48 41.118L67.798 160c-.423 2.012-2.124 2.252-3.992 1.858-1.867-.396-3.327-1.302-2.902-3.312l4.24-20.112c-22.88-6.772-38.245-32.817-34.163-60.014l-18.963-3.994c-2.01-.424-2.252-2.125-1.86-3.992.395-1.868 1.302-3.327 3.313-2.903l18.963 3.998c7.303-26.82 31.812-44.158 55.48-41.12l3.905-18.532c.393-1.867 2.095-2.11 3.962-1.715 1.867.395 3.326 1.303 2.933 3.17l-3.906 18.532c22.88 6.773 38.418 32.704 34.164 60.015l17.095 3.604c2.012.423 2.254 2.124 1.86 3.992zm-91.07-22.797l20.4 4.3 8.963-42.522c-20.763-2.576-24.457 14.95-29.362 38.222zm9.742 54.867L75.8 87.87l-20.398-4.3c-4.52 22.154-6.884 41.91 11.194 47.972zm26.516-91.635l-8.963 42.52 21.116 4.454c4.906-23.273 7.596-41.01-12.154-46.973zm10.7 53.868l-21.116-4.45-9.205 43.67c18.413 1.63 25.26-17.33 30.323-39.22z"
                />
            </svg>
        );
    },
});
