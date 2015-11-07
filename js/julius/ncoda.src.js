// React components for Julius, the nCoda user interface
//
// File Name: js/julius/ncoda.src.js
// Purpose: React components for the Julius itself.
//
// Copyright 2015 Christopher Antila
//


import React from 'react';
import StructureView from './structure_view.src';
import CodeScoreView from './code_score_view.src';


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


// TODO: consolidate MenuItem and GlobalMenu somehow onto an nCoda-global component
var MenuItem = React.createClass({
    propTypes: {
        // The @id attribute to set on the <menuitem>
        id: React.PropTypes.string,
        // The @label and text of the <menuitem>
        label: React.PropTypes.string,
        // The function to call when the <menuitem> is clicked.
        onClick: React.PropTypes.func
    },
    render: function() {
        return (
            <menuitem id={this.props.id} label={this.props.label} onClick={this.props.onClick}>
                {this.props.label}
            </menuitem>
        );
    }
});


var GlobalMenu = React.createClass({
    propTypes: {
        // Whether the menu is currently shown.
        showMenu: React.PropTypes.bool,
        // A function with which to change the currently active main view.
        changeView: React.PropTypes.func,
    },
    getDefaultProps: function() {
        return {showMenu: false};
    },
    handleMenuSelection: function(event) {
        let switchTo = '';

        switch (event.target.id) {
            case 'global-0':
                switchTo = 'default';
                break;

            case 'global-1':
                switchTo = 'CodeScoreView';
                break;

            case 'global-2':
                switchTo = 'StructureView';
                break;
        };

        this.props.changeView(switchTo);
    },
    render: function() {
        let globalMenuStyle = {};
        if (this.props.showMenu) {
            globalMenuStyle['display'] = 'block';
        } else {
            globalMenuStyle['display'] = 'none';
        }

        return (
            <menu id="ncoda-global-menu" style={globalMenuStyle}>
                <MenuItem id="global-0" label="Home" onClick={this.handleMenuSelection}/>
                <MenuItem id="global-1" label="Open CodeScoreView" onClick={this.handleMenuSelection}/>
                <MenuItem id="global-2" label="Open StructureView" onClick={this.handleMenuSelection}/>
            </menu>
        );
    }
});


var NCoda = React.createClass({
    //
    // State:
    // - menuShown (boolean): Whether the menu is shown. Obviously.
    // - activeView (str): Currently active main view. Default is "default."
    //

    getInitialState: function() {
        return ({menuShown: false, activeView: 'default'});
    },
    showOrHideGlobalMenu: function() {
        // If the global menu is shown, hide it.
        // If the global menu is hiddent, show it.
        //
        this.setState({menuShown: !this.state.menuShown});
    },
    changeActiveView: function(toWhich) {
        // Change the currently-active primary view component to another.
        //
        // View Currently Supported:
        // - default
        // - CodeScoreView
        // - StructureView
        //
        // If the new view is not recognized, this function logs a message to the console and quits.
        //

        if ('default' === toWhich || 'CodeScoreView' === toWhich || 'StructureView' === toWhich) {
            this.setState({activeView: toWhich, menuShown: false});
        } else {
            let msg = `NCoda.changeActiveView() called with unknown view ("${toWhich}")`;
            console.error(msg);
        }
    },
    render: function() {
        // TODO: figure out the accessibility stuff for the main menu button
        let viewName = '';
        let activeScreen = '';

        switch (this.state.activeView) {
            case 'CodeScoreView':
                viewName = 'CodeScoreView';
                activeScreen = <CodeScoreView/>;
                break;

            case 'StructureView':
                viewName = 'StructureView';
                activeScreen = <StructureView/>;
                break;

            default:
                viewName = 'Home';
                activeScreen = <MainScreen/>;
        };

        return (
            <div id="ncoda">
                <div id="ncoda-global-header">
                    <button onClick={this.showOrHideGlobalMenu}>
                        <i className="fa fa-bars fa-2x"></i>
                    </button>
                    <h1 className="ncoda-logo">
                        <div className="ncoda-logo-n">n</div>Coda
                    </h1>
                    <div className="ncoda-view-name">{viewName}</div>
                </div>

                <div id="ncoda-content">
                    <GlobalMenu showMenu={this.state.menuShown} changeView={this.changeActiveView}/>
                    {activeScreen}
                </div>
            </div>
        );
    }
});


export default NCoda;
