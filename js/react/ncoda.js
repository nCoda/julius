// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/ncoda.js
// Purpose:                React components for nCoda in general.
//
// Copyright (C) 2015 Christopher Antila
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


import {Button, CollapsibleNav, Dropdown, Nav, NavItem, Topbar} from 'amazeui-react';
import React from 'react';
import {Link} from 'react-router';

import {log} from '../util/log';
import signals from '../nuclear/signals';
import {DialogueBox} from './generics';


const MainScreen = React.createClass({
    render() {
        return (
            <div id="ncoda-loading">
                <section>
                    {`Use the `}<i className="fa fa-th"></i>
                    {` button in the top-left corner to open the menu.`}
                </section>
                <MainScreenQuote/>
            </div>
        );
    },
});


const MainScreenQuote = React.createClass({
    getInitialState() {
        return {
            attribution: 'Chuck Close',
            cite: 'https://www.brainpickings.org/index.php/2012/12/27/chuck-close-on-creativity/',
            quote: 'Inspiration is for amateurs\u2014the rest of us just show up and get to work.',
        };
    },
    render() {
        return (
            <blockquote cite={this.state.cite}>
                <i className="fa fa-quote-left"/>
                <p>{this.state.quote}</p>
                <i className="fa fa-quote-right"/>
                <small>{`\u2014 ${this.state.attribution}`}</small>
            </blockquote>
        );
    },
});


const Colophon = React.createClass({
    render() {
        return (
            <div id="ncoda-colophon">
                <img src="img/nCoda-logo.svg" alt="nCoda" />
                <div>
                    <h2>{`About nCoda`}</h2>
                    <p>{`Many people contribute to nCoda. Learn about them at URL.`}</p>
                    <p>{`You must follow the GPLv3 software license when you use nCoda. Learn about your rights and responsibilities at URL.`}</p>
                    <p>{`The nCoda source code is available at no direct cost from URL.`}</p>
                    <p>{`We use many third-party software components to build nCoda. Learn about them at URL.`}</p>
                </div>
            </div>
        );
    },
});


const GlobalHeader = React.createClass({
    // This is the header bar that should always appear at the top of the screen.
    //
    // Props:
    // - handleShowMenu (func): Called without arguments to show or hide the main menu.
    // - handleShowDevelMenu (func): Called without arguments to show or hide the developer menu.

    propTypes: {
        handleShowDevelMenu: React.PropTypes.func,
        handleShowMenu: React.PropTypes.func.isRequired,
    },
    render() {
        const brand = (
            <h1 className="ncoda-logo">
                <img src="img/nCoda-logo.svg" />
            </h1>
        );

        return (
            <Topbar brand={brand} toggleNavKey="nav" inverse fixedTop>
                <CollapsibleNav eventKey="nav">
                    <Nav topbar>
                        <NavItem><Link to="/">{`Home`}</Link></NavItem>
                        <NavItem><Link to="/colophon">{`About`}</Link></NavItem>
                        <NavItem><Link to="/codescore">{`CodeScoreView`}</Link></NavItem>
                        <NavItem><Link to="/structure">{`StructureView`}</Link></NavItem>
                        <NavItem><DeveloperMenu/></NavItem>
                    </Nav>
                </CollapsibleNav>
            </Topbar>
        );
    },
});


// TODO: abandon this in favour of amazeui menus
// TODO: it's used in other modules (probably just StructureView?)
const MenuItem = React.createClass({
    propTypes: {
        // A function that closes the menu once a menu item has been chosen.
        handleCloseMenu: React.PropTypes.func,
        // The @id attribute to set on the <menuitem>
        id: React.PropTypes.string,
        // The @label and text of the <menuitem>
        label: React.PropTypes.string,
        // The URL to redirect to when this <menuitem> is selected.
        linkTo: React.PropTypes.string,
    },
    render() {
        return (
            <li id={this.props.id} onClick={this.props.handleCloseMenu}>
                <Link to={this.props.linkTo}>
                    {this.props.label}
                </Link>
            </li>
        );
    },
});


const DeveloperMenu = React.createClass({
    /** Handle a click on one of the menu items.
     * @param {ClickEvent} event - The click event.
     */
    handleClick(event) {
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
        case 'devel-3':
            signals.emitters.setLogLevel(log.LEVELS.DEBUG);
            break;
        case 'devel-4':
            signals.emitters.setLogLevel(log.LEVELS.INFO);
            break;
        case 'devel-5':
            signals.emitters.setLogLevel(log.LEVELS.WARN);
            break;
        case 'devel-6':
            signals.emitters.setLogLevel(log.LEVELS.ERROR);
            break;
        default:
            log.warn('The DeveloperMenu component is misconfigured, so nothing will happen.');
        }
    },
    render() {
        return (
            <Dropdown title={<i className="fa fa-wrench fa-2x"/>} btnStyle="link">
                <Dropdown.Item header>{`Fujian WebSocket Connection`}</Dropdown.Item>
                <Dropdown.Item closeOnClick>
                    <Button id="devel-0" amStyle="link" onClick={this.handleClick}>
                        {`Start`}
                    </Button>
                </Dropdown.Item>
                <Dropdown.Item closeOnClick>
                    <Button id="devel-1" amStyle="link" onClick={this.handleClick}>
                        {`Restart`}
                    </Button>
                </Dropdown.Item>
                <Dropdown.Item closeOnClick>
                    <Button id="devel-2" amStyle="link" onClick={this.handleClick}>
                        {`Stop`}
                    </Button>
                </Dropdown.Item>
                <Dropdown.Item divider/>
                <Dropdown.Item header>{`Log Level`}</Dropdown.Item>
                <Dropdown.Item closeOnClick>
                    <Button id="devel-3" amStyle="link" onClick={this.handleClick}>
                        {`Set to DEBUG`}
                    </Button>
                </Dropdown.Item>
                <Dropdown.Item closeOnClick>
                    <Button id="devel-4" amStyle="link" onClick={this.handleClick}>
                        {`Set to INFO`}
                    </Button>
                </Dropdown.Item>
                <Dropdown.Item closeOnClick>
                    <Button id="devel-5" amStyle="link" onClick={this.handleClick}>
                        {`Set to WARN`}
                    </Button>
                </Dropdown.Item>
                <Dropdown.Item closeOnClick>
                    <Button id="devel-6" amStyle="link" onClick={this.handleClick}>
                        {`Set to ERROR`}
                    </Button>
                </Dropdown.Item>
            </Dropdown>
        );
    },
});


const NCoda = React.createClass({
    //
    // State:
    // - menuShown (boolean): Whether the menu is shown. Obviously.
    // - develMenuShown (boolean): Whether the developer menu is shown.
    // - activeView (str): Currently active main view. Default is "default."
    //

    propTypes: {
        children: React.PropTypes.element,
    },
    getInitialState() {
        return ({menuShown: false, develMenuShown: false, activeView: 'default'});
    },
    showOrHideGlobalMenu() {
        // If the global menu is shown, hide it.
        // If the global menu is hiddent, show it.
        //
        this.setState({menuShown: !this.state.menuShown});
    },
    showOrHideDevelMenu() {
        // If the developer menu is shown, hide it.
        // If the developer menu is hidden, show it.
        //
        this.setState({develMenuShown: !this.state.develMenuShown});
    },
    render() {
        return (
            <div id="ncoda">
                <GlobalHeader handleShowMenu={this.showOrHideGlobalMenu} handleShowDevelMenu={this.showOrHideDevelMenu}/>
                <DialogueBox/>
                {this.props.children}
            </div>
        );
    },
});


export default NCoda;
export {
    Colophon,
    MainScreen,
    MenuItem,
};
