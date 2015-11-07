// React components for Julius, the nCoda user interface
//
// File Name: js/julius/structure_view.src.js
// Purpose: React components for the Julius "StructureView."
//
// Copyright 2015 Christopher Antila

import immutable from 'immutable';

import React from 'react';
import reactor from './reactor.src';
import getters from './getters.src';
import signals from './signals.src';


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
            <div className="ncoda-headerbar">
                <div className="header">Header Bar
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
                <img src="../../structureview_mock/expanded_section_view.svg"></img>
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
            <div className="ncoda-expanded-section">
                <p>
                    <ShowOrHideButton func={this.showOrHide} expands="down" isShown={this.state.showGraph}/>
                    Expanded Section View
                </p>
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


var StructureViewHeader = React.createClass({
    render: function() {
        return (
            <header>
                <HeaderBar/>
                <ExpandedSectionView/>
            </header>
        );
    }
});


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


var SectionContextMenu = React.createClass({
    // The context menu that appears when users click on a Section.
    handleClick: function(event) {
        // Hide the context menu then show an alert acknowledging the click.
        let msg = `${event.target.label}?\nWill do!`;
        let menu = document.getElementById('ncoda-section-menu');
        menu.style.display = 'none';
        alert(msg);
    },
    render: function() {
        return (
            <menu id="ncoda-section-menu">
                <MenuItem id="ncoda-section-menu-item-1" label="Open in CodeScoreView" onClick={this.handleClick}/>
                <MenuItem id="ncoda-section-menu-item-2" label="View Version History" onClick={this.handleClick}/>
                <MenuItem id="ncoda-section-menu-item-3" label="Download Source File" onClick={this.handleClick}/>
            </menu>
        );
    }
});


var StructureViewMenus = React.createClass({
    render: function() {
        return (
            <div id="ncoda-menus">
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
            React.PropTypes.instanceOf(immutable.Map),
            React.PropTypes.instanceOf(immutable.List),
        ]).isRequired
    },
    render: function() {
        if (immutable.Map.isMap(this.props.names)) {
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
            <ul id="scorestructure-instruments">
                {this.state.partsList.map(function(parts, index) {
                    return (<StaffGroupOrStaff key={index} names={parts}/>);
                })}
            </ul>
        );
    }
});


var ScoreStructure = React.createClass({
    // ScoreStructure
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
            <div className="ncoda-scorestructure">
                <p>Score Structure
                    <ShowOrHideButton func={this.showOrHide} expands="up" isShown={this.state.showParts}/>
                </p>
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
            <div className="ncoda-collaboration-person">
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
            <div id="ncoda-collaborators-list">
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
            <div className="ncoda-collaboration">
                <p>
                    <ShowOrHideButton func={this.showOrHide} expands="up" isShown={this.state.showCollaborators}/>
                    Collaborators
                </p>
                {collabList}
            </div>
        );
    }
});


var StructureViewFooter = React.createClass({
    render: function() {
        return (
            <footer>
                <ScoreStructure/>
                <Collaboration/>
            </footer>
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
        onClick: React.PropTypes.func.isRequired,
        colour: React.PropTypes.string
    },
    getDefaultProps: function() {
        return {colour: '#000'};
    },
    render: function() {
        let headerStyleAttr = {background: this.props.colour};

        return (
            <article className="ncoda-mei-section" id={`section-${this.props.id}`} onClick={this.props.onClick}>
                <header style={headerStyleAttr}>
                    {this.props.name}
                </header>
                <div className="ncoda-mei-section-img">
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
        let bLastUpdated = {name: 'Gloria Steinem', date: '2015-10-09'};
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
                        pathToImage="../../structureview_mock/sectionA.png"
                        onClick={this.props.openContextMenu}
                        colour={aColour}
                    />
                    <Section
                        id="b"
                        name="B"
                        lastUpdated={bLastUpdated}
                        pathToImage="../../structureview_mock/sectionB.png"
                        onClick={this.props.openContextMenu}
                        colour={bColour}
                    />
                    <Section
                        id="ap"
                        name={"A\u2032"}
                        lastUpdated={aLastUpdated}
                        pathToImage="../../structureview_mock/sectionA.png"
                        onClick={this.props.openContextMenu}
                        colour={aColour}
                    />
                    <Section
                        id="c"
                        name="C"
                        lastUpdated={cLastUpdated}
                        pathToImage="../../structureview_mock/sectionC.png"
                        onClick={this.props.openContextMenu}
                        colour={cColour}
                    />
                    <Section
                        id="app"
                        name={"A\u2032\u2032"}
                        lastUpdated={aLastUpdated}
                        pathToImage="../../structureview_mock/sectionA.png"
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
            <div className="ncoda-structureview-frame">
                <StructureViewMenus/>
                <div id="ncoda-structureview" className="ncoda-structureview">
                    <StructureViewHeader/>
                    <ActiveSections openContextMenu={this.showSectionContextMenu}/>
                    <StructureViewFooter/>
                </div>
            </div>
        );
    }
});

export default StructureView;
