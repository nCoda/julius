// -*- coding: utf-8 -*-
//-------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/ncoda.js
// Purpose:                React components for nCoda in general.
//
// Copyright (C) 2015 Christopher Antila
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


import React from 'react';
import {Link} from 'react-router';
import signals from '../nuclear/signals';


var MainScreen = React.createClass({
    //
    //

    render: function() {
        return (
            <div id="ncoda-loading">
                <div>Use the <i className="fa fa-bars"></i> button in the top-left corner to open the menu.</div>
            </div>
        );
    }
});


var Colophon = React.createClass({
    //
    //

    render: function() {
        return (
            <div id="ncoda-colophon">
                <img src="img/nCoda-temporary_logo_square-180x180.png" alt="nCoda logo"></img>
                <div>
                    <h2>About nCoda</h2>
                    <p>Many people contribute to nCoda. Learn about them at URL.</p>
                    <p>You must follow the GPLv3 software license when you use nCoda. Learn about your rights and responsibilities at URL.</p>
                    <p>The nCoda source code is available at no direct cost from URL.</p>
                    <p>We use many third-party software components to build nCoda. Learn about them at URL.</p>
                </div>
            </div>
        );
    }
});


var GlobalHeader = React.createClass({
    // This is the header bar that should always appear at the top of the screen.
    //
    // Props:
    // - showHideMenu (func): Called without arguments to show or hide the main menu.
    // - showHideDevel (func): Called without arguments to show or hide the developer menu.

    propTypes: {
        showHideMenu: React.PropTypes.func.isRequired,
        showHideDevel: React.PropTypes.func,
    },
    render: function() {
        return (
            <div id="ncoda-global-header">
                <button onClick={this.props.showHideMenu}>
                    <i className="fa fa-th fa-2x"></i>
                </button>
                <h1 className="ncoda-logo">
                    <div className="ncoda-logo-n">n</div>Coda
                </h1>
                <button onClick={this.props.showHideDevel}>
                    <i className="fa fa-wrench fa-2x"></i>
                </button>
            </div>
        );
    }
});


// TODO: consolidate MenuItem and GlobalMenu somehow onto an nCoda-global component
var MenuItem = React.createClass({
    propTypes: {
        // The @id attribute to set on the <menuitem>
        id: React.PropTypes.string,
        // The @label and text of the <menuitem>
        label: React.PropTypes.string,
        // The URL to redirect to when this <menuitem> is selected.
        linkTo: React.PropTypes.string,
        // A function that closes the menu once a menu item has been chosen.
        closeThatMenu: React.PropTypes.func,
    },
    render: function() {
        return (
            <li id={this.props.id} onClick={this.props.closeThatMenu}>
                <Link to={this.props.linkTo}>
                    {this.props.label}
                </Link>
            </li>
        );
    }
});


var GlobalMenu = React.createClass({
    propTypes: {
        // Whether the menu is currently shown.
        showMenu: React.PropTypes.bool,
        // A function that closes the menu once a menu item has been chosen.
        closeThatMenu: React.PropTypes.func,
    },
    getDefaultProps: function() {
        return {showMenu: false};
    },
    render: function() {
        let globalMenuStyle = {};
        if (this.props.showMenu) {
            globalMenuStyle['display'] = 'block';
        } else {
            globalMenuStyle['display'] = 'none';
        }

        return (
            <nav id="ncoda-global-menu" style={globalMenuStyle}>
                <ul>
                    <MenuItem id="global-0" label="Home" linkTo="/" closeThatMenu={this.props.closeThatMenu}/>
                    <MenuItem id="global-1" label="Open CodeScoreView" linkTo="/codescore" closeThatMenu={this.props.closeThatMenu}/>
                    <MenuItem id="global-2" label="Open StructureView" linkTo="/structure" closeThatMenu={this.props.closeThatMenu}/>
                    <hr/>
                    <MenuItem id="global-3" label="About nCoda" linkTo="/colophon" closeThatMenu={this.props.closeThatMenu}/>
                </ul>
            </nav>
        );
    }
});


var DeveloperMenu = React.createClass({
    propTypes: {
        // Whether the menu is currently shown.
        showMenu: React.PropTypes.bool,
        // A function that closes the menu once a menu item has been chosen.
        closeThatMenu: React.PropTypes.func.isRequired,
    },
    getDefaultProps: function() {
        return {showMenu: false};
    },
    onClick: function(event) {
        // Handle a click on the menu items.

        this.props.closeThatMenu();
        switch (event.target.id) {
            case 'devel-0':
                signals.emitters.fujianStartWS();
                break;
            case 'devel-1':
                signals.emitters.fujianRestartWS();
                break;
            case 'devel-2':
                signals.emitters.fujianStopWS();
                break;
        }
    },
    render: function() {
        let globalMenuStyle = {};
        if (this.props.showMenu) {
            globalMenuStyle['display'] = 'block';
        } else {
            globalMenuStyle['display'] = 'none';
        }

        return (
            <nav id="ncoda-devel-menu" style={globalMenuStyle}>
                <ul>
                    <li>nCoda Developer Menu</li>
                    <hr/>
                    <h4>Fujian WebSocket Connection</h4>
                    <li id="devel-0" onClick={this.onClick}>Start</li>
                    <li id="devel-1" onClick={this.onClick}>Restart</li>
                    <li id="devel-2" onClick={this.onClick}>Stop</li>
                </ul>
            </nav>
        );
    }
});


var NCoda = React.createClass({
    //
    // State:
    // - menuShown (boolean): Whether the menu is shown. Obviously.
    // - develMenuShown (boolean): Whether the developer menu is shown.
    // - activeView (str): Currently active main view. Default is "default."
    //

    getInitialState: function() {
        return ({menuShown: false, develMenuShown: false, activeView: 'default'});
    },
    showOrHideGlobalMenu: function() {
        // If the global menu is shown, hide it.
        // If the global menu is hiddent, show it.
        //
        this.setState({menuShown: !this.state.menuShown});
    },
    showOrHideDevelMenu: function() {
        // If the developer menu is shown, hide it.
        // If the developer menu is hidden, show it.
        //
        this.setState({develMenuShown: !this.state.develMenuShown});
    },
    render: function() {
        // TODO: figure out the accessibility stuff for the main menu button
        return (
            <div id="ncoda">
                <GlobalHeader showHideMenu={this.showOrHideGlobalMenu} showHideDevel={this.showOrHideDevelMenu}/>

                <div id="ncoda-content">
                    <GlobalMenu showMenu={this.state.menuShown} closeThatMenu={this.showOrHideGlobalMenu}/>
                    <DeveloperMenu showMenu={this.state.develMenuShown} closeThatMenu={this.showOrHideDevelMenu}/>
                    {this.props.children}
                </div>
            </div>
        );
    }
});


export default NCoda;
export {
    Colophon,
    MainScreen,
    MenuItem,
};
