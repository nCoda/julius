// -*- coding: utf-8 -*-
//-------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/structure_view.js
// Purpose:                React components for StructureView.
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


import {Immutable} from 'nuclear-js';

import React from 'react';
import reactor from '../nuclear/reactor';
import getters from '../nuclear/getters';
import signals from '../nuclear/signals';

import {MenuItem} from './ncoda';


var MetadataField = React.createClass({
    //

    propTypes: {
        // The name of this metadata field.
        name: React.PropTypes.string,
        // The value of this metadata field.
        value: React.PropTypes.string
    },
    getDefaultProps: function() {
        return {name: '', value: ''};
    },
    editHeader: function() {
        let value = prompt('Enter the new value.');
        if (null !== value && value.length > 0) {
            signals.emitters.changeHeader(this.props.name, value);
        }
    },
    removeHeader: function(event) {
        event.stopPropagation();
        signals.emitters.removeHeader(this.props.name);
    },
    render: function() {
        let display = `${this.props.name}: ${this.props.value}`;
        return (
            <li onClick={this.editHeader}>
                <i className="fa fa-minus-square" onClick={this.removeHeader}></i>
                {display}
            </li>
        );
    }
});


var HeaderList = React.createClass({
    //

    mixins: [reactor.ReactMixin],
    getDataBindings: function() {
        return {headers: getters.meiHeadersList};
    },
    addNewHeader: function() {
        // Does whatever's required to add a new header.
        let name = prompt('Put in the field name.');
        let value = prompt('Put in the field value.');
        signals.emitters.addHeader(name, value);
    },
    render: function() {
        return (
            <ul id="headerbar-list" className="headers">
                {this.state.headers.map(field =>
                    <MetadataField name={field.get('name')} value={field.get('value')}/>
                )}
                <li onClick={this.addNewHeader}><i className="fa fa-plus-square"></i></li>
            </ul>
        );
    }
});


var HeaderBar = React.createClass({
    // HeaderBar
    //
    // State
    // - showHeaderList: whether the list of headers is visible (true) or invisible (false)
    //

    getInitialState: function() {
        return {showHeaderList: false};
    },
    showOrHide: function() {
        this.setState({showHeaderList: !this.state.showHeaderList});
    },
    render: function() {
        let headerList = '';
        if (this.state.showHeaderList) {
            headerList = <HeaderList/>;
        }

        return (
            <div className="nc-strv-menu" id="nc-strv-header-bar">
                <div className="header">
                    Header Bar
                    <ShowOrHideButton func={this.showOrHide} expands="down" isShown={this.state.showHeaderList}/>
                </div>
                {headerList}
            </div>
        );
    }
});


var ExpandedSectionViewGraph = React.createClass({
    render: function() {
        return (
            <div id="ncoda-expanded-section-svg">
                <h2>A</h2>
                <img src="structureview_mock/expanded_section_view.svg"></img>
            </div>
        );
    }
});


var ExpandedSectionView = React.createClass({
    // ExpandedSectionView
    //
    // State
    // - showGraph: whether the SVG graph is visible (true) or invisible (false)
    //

    getInitialState: function() {
        return {showGraph: false};
    },
    showOrHide: function() {
        this.setState({showGraph: !this.state.showGraph});
    },
    render: function() {
        let graph = '';
        if (this.state.showGraph) {
            graph = <ExpandedSectionViewGraph/>;
        }

        return (
            <div className="nc-strv-menu" id="nc-strv-expanded-section">
                <div className="header">
                    <ShowOrHideButton func={this.showOrHide} expands="down" isShown={this.state.showGraph}/>
                    Expanded Section View
                </div>
                {graph}
            </div>
        );
    }
});


var ShowOrHideButton = React.createClass({
    // ShowOrHideButton
    //
    // Render a button to show or hide another component. This component does not do the showing or
    // hiding itself, but rather calls a no-argument function to do that.
    //
    // Props:
    // - func (function) This function is called without arguments when the button is clicked.
    // - isShown (boolean) Whether the component shown/hidden by this button is currently shown.
    // - expands (string) Either 'up,' 'down', 'left', or 'right', depending on the direction the
    //     shown/hidden component moves when it expands.
    //

    propTypes: {
        func: React.PropTypes.func.isRequired,
        isShown: React.PropTypes.bool,
        expands: React.PropTypes.oneOf(['up', 'down', 'left', 'right', 'expand'])
    },
    getDefaultProps: function() {
        return {expands: 'expand'};
    },
    render: function() {
        let className = '';

        if ('expand' === this.props.expands) {
            className = 'fa-expand';
        } else if (false === this.props.isShown) {
            // the chevron points in the direction of this.props.expands
            className = `fa-chevron-${this.props.expands}`;
        } else if (true === this.props.isShown) {
            // the chevron points opposite the direction of this.props.expands
            switch (this.props.expands) {
                case 'up':
                    className = 'fa-chevron-down';
                    break;
                case 'down':
                    className = 'fa-chevron-up';
                    break;
                case 'left':
                    className = 'fa-chevron-right';
                    break;
                case 'right':
                    className = 'fa-chevron-left';
                    break;
            }
        } else {
            className = 'fa-expand';
        }

        className = `fa ${className}`;

        return (
            <button name="show-or-hide-button" className="show-or-hide-button" type="button" onClick={this.props.func}>
                <i className={className}></i>
            </button>
        );
    }
});


var SectionContextMenu = React.createClass({
    // This menu appears when users click on a Section component.
    //

    mixins: [reactor.ReactMixin],
    getDataBindings: function() {
        return {style: getters.sectionContextMenu};
    },
    closeMenu: function(event) {
        // Handle a click on the menu items.
        signals.emitters.sectionContextMenu({show: false});
    },
    render: function() {
        return (
            <nav id="ncoda-section-menu" style={this.state.style.toObject()}>
                <ul>
                    <MenuItem id="ncoda-section-menu-1" label="Open CodeScoreView" linkTo="/structure" closeThatMenu={this.closeMenu}/>
                    <MenuItem id="ncoda-section-menu-2" label="View Version History" linkTo="/structure" closeThatMenu={this.closeMenu}/>
                    <MenuItem id="ncoda-section-menu-3" label="Download Source File" linkTo="/structure" closeThatMenu={this.closeMenu}/>
                </ul>
            </nav>
        );
    }
});


var ContextMenus = React.createClass({
    render: function() {
        return (
            <div>
                <SectionContextMenu/>
            </div>
        );
    }
});


var StaffGroupOrStaff = React.createClass({
    // Given either a StaffGroup or a Staff, this component returns the proper stuff.
    //
    // Props:
    // - names (Map, or List of Map): The names of staves to render.
    //
    // If "names" is a Map, this component renders a Staff. If "names" is an Array of Maps,
    // this component renders a StaffGroup with each string as a contained Staff.

    propTypes: {
        names: React.PropTypes.oneOfType([
            React.PropTypes.instanceOf(Immutable.Map),
            React.PropTypes.instanceOf(Immutable.List),
        ]).isRequired
    },
    render: function() {
        if (Immutable.Map.isMap(this.props.names)) {
            return (
                <li>{this.props.names.get('label')}</li>
            );
        } else {
            return (
                <li><ul>
                    {this.props.names.map(name =>
                        <li key={name.get('label').toLowerCase()}>{name}</li>
                    )}
                </ul></li>
            );
        }
    }
})


var PartsList = React.createClass({
    mixins: [reactor.ReactMixin],
    getDataBindings: function() {
        return {partsList: getters.listOfInstruments};
    },
    render: function() {
        return (
            <ul id="staves-instruments">
                {this.state.partsList.map(function(parts, index) {
                    return (<StaffGroupOrStaff key={index} names={parts}/>);
                })}
            </ul>
        );
    }
});


var StavesStructure = React.createClass({
    // StavesStructure
    //
    // State
    // - showParts: whether the list of parts is visible (true) or invisible (false)
    //

    getInitialState: function() {
        return {showParts: false};
    },
    showOrHide: function() {
        this.setState({showParts: !this.state.showParts});
    },
    render: function() {
        let partsList = '';
        if (this.state.showParts) {
            partsList = <PartsList/>;
        }

        return (
            <div className="nc-strv-menu" id="nc-strv-staves">
                <div className="header">
                    Staves Structure
                    <ShowOrHideButton func={this.showOrHide} expands="up" isShown={this.state.showParts}/>
                </div>
                {partsList}
            </div>
        );
    }
});


var Changeset = React.createClass({
    // Information about a changeset.
    //
    // Props:
    // - date (string): The date of the changeset, YYYY-MM-DD.
    // - message (string): The message associated with the changeset.
    //

    propTypes: {
        date: React.PropTypes.string.isRequired,
        message: React.PropTypes.string.isRequired
    },
    render: function() {
        return (
            <li><time dateTime={this.props.date}>{this.props.date}</time>: {this.props.message}</li>
        );
    }
});


var Collaborator = React.createClass({
    // Information about a collaborator and their recent changesets.
    //
    // Props:
    // - name (string): The collaborator's name, whether a username, their real name, or other.
    // - changesets (list of object): A list of this person's recent changesets. Refer to the
    //     "Changeset" component for a description of the "date" and "message" props.
    //

    propTypes: {
        name: React.PropTypes.string,
        changesets: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                date: React.PropTypes.string,
                message: React.PropTypes.string
            }))
    },
    render: function() {
        return (
            <div>
                <address>{this.props.name}</address>
                <ul>
                    {this.props.changesets.map(changeset =>
                        <Changeset date={changeset.get('date')} message={changeset.get('summary')}/>
                    )}
                </ul>
            </div>
        );
    }
});


var CollaboratorList = React.createClass({
    //

    mixins: [reactor.ReactMixin],
    getDataBindings: function() {
        return {history: getters.hgChangesetHistory};
    },
    render: function() {
        // who has changesets in this repository?
        let names = [];
        this.state.history.forEach(function(changeset) {
            let name = changeset.get('name');
            if (undefined !== name && name.length > 0 && -1 === names.indexOf(name)) {
                names.push(name);
            }
        });

        // build collaborator-specific collections of changesets
        let collaborators = names.map(name =>
            this.state.history.filter(changeset =>
                (changeset.get('name') === name) ? true : false
            )
        );

        return (
            <div>
                {collaborators.map(person =>
                    <Collaborator name={person.get(0).get('name')} changesets={person}/>
                )}
            </div>
        );
    }
});


var Collaboration = React.createClass({
    // Collaboration
    //
    // State
    // - showCollaborators: whether the list of collaborators is visible (true) or invisible (false)
    //

    getInitialState: function() {
        return {showCollaborators: false};
    },
    showOrHide: function() {
        this.setState({showCollaborators: !this.state.showCollaborators});
    },
    render: function() {
        let collabList = '';
        if (this.state.showCollaborators) {
            collabList = <CollaboratorList/>;
        }

        return (
            <div className="nc-strv-menu" id="nc-strv-collaboration">
                <div className="header">
                    <ShowOrHideButton func={this.showOrHide} expands="up" isShown={this.state.showCollaborators}/>
                    Collaborators
                </div>
                {collabList}
            </div>
        );
    }
});


var Section = React.createClass({
    propTypes: {
        name: React.PropTypes.string,
        id: React.PropTypes.string,
        lastUpdated: React.PropTypes.shape({
            name: React.PropTypes.string,
            date: React.PropTypes.string
        }),
        pathToImage: React.PropTypes.string,
        colour: React.PropTypes.string
    },
    getDefaultProps: function() {
        return {colour: '#000'};
    },
    onClick: function(event) {
        // Set the NuclearJS state required to show the context menu.
        let style = {show: true};
        style.left = event.clientX + 'px';
        style.top = event.clientY + 'px';
        signals.emitters.sectionContextMenu(style);
    },
    render: function() {
        let headerStyleAttr = {background: this.props.colour};

        return (
            <article className="nc-strv-section" id={`section-${this.props.id}`} onClick={this.onClick}>
                <header>
                    {this.props.name}
                    <div className="ncoda-section-colour" style={headerStyleAttr}></div>
                </header>
                <div className="nc-strv-section-img">
                    <img src={this.props.pathToImage}/>
                </div>
                <footer>
                    <address>{this.props.lastUpdated.name}</address>
                    <time dateTime={this.props.lastUpdated.date}>{this.props.lastUpdated.date}</time>
                </footer>
            </article>
        );
    }
});


var ActiveSections = React.createClass({
    propTypes: {
        // A function that, when called with no argument, opens the SectionContextMenu in the right place.
        openContextMenu: React.PropTypes.func.isRequired
    },
    render: function() {
        let aLastUpdated = {name: 'Christopher Antila', date: '2015-10-06'};
        let bLastUpdated = {name: 'Honoré de Balzac', date: '2015-10-09'};
        let cLastUpdated = {name: '卓文萱', date: '2015-05-07'};
        let aColour = 'rgba(0, 191, 255, 0.6)';
        let bColour = 'rgba(218, 165, 32, 0.6)';
        let cColour = 'rgba(255, 127, 80, 0.6)';

        return (
            <article className="ncoda-active-sections">
                <header>
                    Active Score
                </header>

                <content>
                    <Section
                        id="a"
                        name="A"
                        lastUpdated={aLastUpdated}
                        pathToImage="structureview_mock/sectionA.png"
                        onClick={this.props.openContextMenu}
                        colour={aColour}
                    />
                    <Section
                        id="b"
                        name="B"
                        lastUpdated={bLastUpdated}
                        pathToImage="structureview_mock/sectionB.png"
                        onClick={this.props.openContextMenu}
                        colour={bColour}
                    />
                    <Section
                        id="ap"
                        name={"A\u2032"}
                        lastUpdated={aLastUpdated}
                        pathToImage="structureview_mock/sectionA.png"
                        onClick={this.props.openContextMenu}
                        colour={aColour}
                    />
                    <Section
                        id="c"
                        name="C"
                        lastUpdated={cLastUpdated}
                        pathToImage="structureview_mock/sectionC.png"
                        onClick={this.props.openContextMenu}
                        colour={cColour}
                    />
                    <Section
                        id="app"
                        name={"A\u2032\u2032"}
                        lastUpdated={aLastUpdated}
                        pathToImage="structureview_mock/sectionA.png"
                        onClick={this.props.openContextMenu}
                        colour={aColour}
                    />
                </content>
            </article>
        );
    }
});


var StructureView = React.createClass({
    showSectionContextMenu: function(event) {
        // Display the context menu under the cursor.
        let menu = document.getElementById('ncoda-section-menu');
        menu.style.left = event.clientX + 'px';
        menu.style.top = event.clientY + 'px';
        menu.style.display = 'flex';
    },
    render: function() {
        return (
            <div id="nc-strv-frame">
                <ContextMenus/>
                <div id="nc-strv-corner-menus">
                    <HeaderBar/>
                    <ExpandedSectionView/>
                    <StavesStructure/>
                    <Collaboration/>
                </div>
                <div id="nc-strv-view">
                    <ActiveSections openContextMenu={this.showSectionContextMenu}/>
                </div>
            </div>
        );
    }
});

export default StructureView;
