// React components for Julius, the nCoda user interface
//
// File Name: js/julius/ncoda.src.js
// Purpose: React components for the Julius itself.
//
// Copyright 2015 Christopher Antila
//


import React from 'react';
import {Link} from 'react-router';
import signals from './signals.src';


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
export {MainScreen};
export {MenuItem};
