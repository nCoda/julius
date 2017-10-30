// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/ncoda.js
// Purpose:                React components for nCoda in general.
//
// Copyright (C) 2016 Christopher Antila, Sienna M. Wood, Wei Gao
// Copyright (C) 2017 Sienna M. Wood, Christopher Antila
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


import { Button, ButtonCheck, Dropdown, Icon, Nav, NavItem, Topbar } from 'amazeui-react';
import React from 'react';
import { Link } from 'react-router';

import { actions as uiActions } from '../stores/ui';
import { actions as metaActions, LOG_LEVELS } from '../stores/meta';

import { log } from '../util/log';
import signals from '../nuclear/signals';
import { DialogueBox, OffCanvas } from './generics';
import { Icon as NCIcon } from './svg_icons';
import { Logo } from './svg_icons';


export const MainScreen = React.createClass({
    handleOpen() {
        if (require) {
            const remote = window.require('electron').remote;
            const dir = remote.dialog.showOpenDialog({
                title: 'Select an existing project folder or create a new one',
                properties: ['openDirectory', 'createDirectory'],
            });
            signals.emitters.lySetRepoDir(dir);
        } else {
            // this is a much worse solution than the native dialogue above
            uiActions.showModal(
                'question',
                'Please enter the repository directory',
                'This can break pretty easily, so be careful!',
                (answer) => signals.emitters.lySetRepoDir(answer),
            );
        }
    },
    handleDefaultOpen() {
        signals.emitters.lyLoadDefaultRepo();
    },
    handleTempOpen() {
        signals.emitters.lyLoadSandboxRepo();
    },
    render() {
        return (
            <div id="ncoda-loading">
                <div className="am-container">
                    <div className="getting-started am-u-sm-10 am-u-sm-offset-1 am-u-md-8 am-u-md-offset-2 am-u-lg-6 am-u-lg-offset-3 am-u-end">
                        <h1 className="am-text-center">{"Getting started with "}<i>{`nCoda`}</i></h1>
                        <ol>
                            <li>
                                <div>
                                    <p>{"Select a project:"}</p>
                                    <ButtonCheck stacked>
                                        <Button onClick={this.handleOpen}>
                                            <input type="checkbox" name="project-source" value="existing"/>
                                            {"Open an "}<strong>{"existing"}</strong>{" project folder..."}
                                        </Button>
                                        <Button onClick={this.handleOpen}>
                                            <input type="checkbox" name="project-source" value="new"/>
                                            {"Create a "}<strong>{"new"}</strong>{" project folder..."}
                                        </Button>
                                        <Button onClick={this.handleDefaultOpen}>
                                            <input type="checkbox" name="project-source" value="demo"/>
                                            {"Open the "}<strong>{"demo"}</strong>{" project"}
                                        </Button>
                                        <Button onClick={this.handleTempOpen}>
                                            <input type="checkbox" name="project-source" value="sandbox"/>
                                            {"Open a new "}<strong>{"sandbox"}</strong>{" project (save disabled)"}
                                        </Button>
                                    </ButtonCheck>
                                </div>
                            </li>
                            <li>
                                <p>
                                    {"Click on the "}
                                    <strong>
                                        <span className="ncoda-color">{"green"}</span>
                                        {" coda symbol"}
                                    </strong>
                                    {" to access the menu and select "}
                                    <strong>{"CodeScoreView"}</strong>
                                </p>
                            </li>
                        </ol>
                    </div>
                </div>
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
            <div className="am-g">
                <div className="am-u-sm-10 am-u-sm-offset-1 am-u-md-8 am-u-md-offset-3 am-u-lg-6 am-u-lg-offset-3 am-u-end">
                    <blockquote cite={this.state.cite} className="nc-quote">
                        <i className="fa fa-quote-left"/>
                        <p>{this.state.quote}</p>
                        <i className="fa fa-quote-right"/>
                        <small>{`\u2014 ${this.state.attribution}`}</small>
                    </blockquote>
                </div>
            </div>
        );
    },
});


export const Colophon = React.createClass({
    render() {
        return (
            <div id="ncoda-colophon">
                <div className="am-g">
                    <div className="am-text-justify am-u-sm-10 am-u-sm-offset-1 am-u-md-8 am-u-md-offset-2 am-u-lg-8 am-u-lg-offset-2 am-u-end">
                        <div className="am-text-center"><Logo /></div>
                        <h2 className="am-text-center">{`About nCoda`}</h2>
                        <p><i>{`nCoda`}</i>{` is the software you're using now, and the community
                            of people who make that software. If you're interested in joining our
                            community of musician-developers, please visit `}
                            <a
                                href="https://spivak.ncodamusic.org/t/getting-started-with-ncoda/154"
                                target="_blank"
                            >
                                {`this thread`}</a>
                            {` on our discussion board for more information.`}
                        </p>
                        <p>
                            {`The `}<i>{`nCoda`}</i>{` software is made available to you under the
                            terms of the GNU General Public Licence (GPL), version 3 or any later
                            version. You can learn about your rights and responsibilities from `}
                            <a href="https://www.gnu.org/licenses/quick-guide-gplv3" target="_blank">
                                {`this quick guide`}</a>{` or by reading `}
                            <a href="https://www.gnu.org/licenses/gpl.html" target="_blank">
                                {`the full license.`}</a>
                        </p>
                        <p>
                            {`In accordance with the GPL, the `}
                            <i>{`nCoda`}</i>
                            {` source code is available for download at no direct cost. Our
                            repositories are hosted on `}
                            <a href="https://goldman.ncodamusic.org/diffusion/" target="_blank">
                                {`Phabricator`}
                            </a>{` in addition to a mirror on `}
                            <a href="https://github.com/ncoda" target="_blank">{`GitHub`}</a>{`.`}
                        </p>
                        <h2 className="am-text-center">{`Need Help?`}</h2>
                        <p>
                            {`We're still working on our documentation for end users. In the meantime,
                            you may wish to consult the user documentation for `}
                            <a
                                href="http://lilypond.org/doc/v2.18/Documentation/notation/index"
                                target="_blank"
                                rel="noopener"
                            >
                                {`LilyPond`}</a>{` and `}
                            <a href="http://abjad.mbrsi.org/" target="_blank" rel="noopener">
                                {`Abjad`}</a>{`.`}
                        </p>
                    </div>
                </div>
            </div>
        );
    },
});


const GlobalMenu = React.createClass({
    propTypes: {
        handleHide: React.PropTypes.func.isRequired,
        showMenu: React.PropTypes.bool.isRequired,
    },
    render() {
        return (
            <nav data-am-widget="menu" className="am-menu am-menu-offcanvas1" data-am-menu-offcanvas>
                <OffCanvas
                    padding={false}
                    showContents={this.props.showMenu}
                    handleHide={this.props.handleHide}
                >
                    <Nav className="am-menu-nav">
                        <NavItem linkComponent={Link} linkProps={{to: "/"}}>
                            {"nCoda Home"}
                        </NavItem>
                        <NavItem linkComponent={Link} linkProps={{to: "/colophon"}}>
                            {"About"}
                        </NavItem>
                        <NavItem linkComponent={Link} linkProps={{to: "/codescore"}}>
                            {"CodeScoreView"}
                        </NavItem>
                    </Nav>
                </OffCanvas>
            </nav>
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
            <Button amStyle="link" onClick={this.props.handleShowMenu} title="Click for Menu">
                <NCIcon type="coda" fill="#50C878" />
            </Button>
        );

        // empty div (automatically hidden by React) used to hide hamburger dropdown menu (for narrow widths)
        // without resorting to CSS
        const toggleBtn = <div></div>;

        return (
            <Topbar brand={brand} toggleBtn={toggleBtn} fixedTop>
                <DeveloperMenu/>
            </Topbar>
        );
    },
});


const DeveloperMenu = React.createClass({
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
            metaActions.setLogLevel(LOG_LEVELS.DEBUG);
            break;
        case 'devel-4':
            metaActions.setLogLevel(LOG_LEVELS.INFO);
            break;
        case 'devel-5':
            metaActions.setLogLevel(LOG_LEVELS.WARN);
            break;
        case 'devel-6':
            metaActions.setLogLevel(LOG_LEVELS.ERROR);
            break;
        default:
            log.warn('The DeveloperMenu component is misconfigured, so nothing will happen.');
        }
    },
    render() {
        return (
            <Dropdown title={<Icon icon="wrench" amSize="md"/>} btnStyle="link">
                <Dropdown.Item header>{"Fujian WebSocket Connection"}</Dropdown.Item>
                <Dropdown.Item closeOnClick>
                    <Button id="devel-0" amStyle="link" onClick={this.handleClick}>
                        {"Start"}
                    </Button>
                </Dropdown.Item>
                <Dropdown.Item closeOnClick>
                    <Button id="devel-1" amStyle="link" onClick={this.handleClick}>
                        {"Restart"}
                    </Button>
                </Dropdown.Item>
                <Dropdown.Item closeOnClick>
                    <Button id="devel-2" amStyle="link" onClick={this.handleClick}>
                        {"Stop"}
                    </Button>
                </Dropdown.Item>
                <Dropdown.Item divider/>
                <Dropdown.Item header>{"Log Level"}</Dropdown.Item>
                <Dropdown.Item closeOnClick>
                    <Button id="devel-3" amStyle="link" onClick={this.handleClick}>
                        {"Set to DEBUG"}
                    </Button>
                </Dropdown.Item>
                <Dropdown.Item closeOnClick>
                    <Button id="devel-4" amStyle="link" onClick={this.handleClick}>
                        {"Set to INFO"}
                    </Button>
                </Dropdown.Item>
                <Dropdown.Item closeOnClick>
                    <Button id="devel-5" amStyle="link" onClick={this.handleClick}>
                        {"Set to WARN"}
                    </Button>
                </Dropdown.Item>
                <Dropdown.Item closeOnClick>
                    <Button id="devel-6" amStyle="link" onClick={this.handleClick}>
                        {"Set to ERROR"}
                    </Button>
                </Dropdown.Item>
            </Dropdown>
        );
    },
});


export const NCoda = React.createClass({
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
        const webFrame = window.require('electron').webFrame;
        webFrame.registerURLSchemeAsPrivileged('file');

        return (
            <div id="ncoda">
                <GlobalHeader
                    handleShowMenu={this.showOrHideGlobalMenu}
                    handleShowDevelMenu={this.showOrHideDevelMenu}
                />
                <DialogueBox/>
                <GlobalMenu showMenu={this.state.menuShown} handleHide={this.showOrHideGlobalMenu}/>
                {this.props.children}
            </div>
        );
    },
});


export default NCoda;
