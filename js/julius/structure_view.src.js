// React components for Julius, the nCoda user interface
//
// File Name: js/julius/structure_view.src.js
// Purpose: React components for the Julius "StructureView."
//
// Copyright 2015 Christopher Antila

import React from "react";


var MetadataField = React.createClass({
    propTypes: {
        // The name of this metadata field.
        fieldName: React.PropTypes.string.isRequired
    },
    onClick: function() {
        alert(`You will be able to edit the ${this.props.fieldName}`);
    },
    render: function() {
        let id = `header-${this.props.fieldName.toLocaleLowerCase()}`;
        return (
            <li id={id} onClick={this.onClick}>{this.props.fieldName}</li>
        );
    }
});


var HeaderList = React.createClass({
    render: function() {
        return (
            <ul id="headerbar-list" className="headers">
                <MetadataField fieldName="Author"/>
                <MetadataField fieldName="Title"/>
                <MetadataField fieldName="Date"/>
                <MetadataField fieldName="+"/>
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
                <p>Header Bar
                    <ShowOrHideButton func={this.showOrHide}/>
                </p>
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
                    <ShowOrHideButton func={this.showOrHide}/>
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
    //

    propTypes: {
        func: React.PropTypes.func.isRequired
    },
    render: function() {
        return (
            <button name="show-or-hide-button" type="button" onClick={this.props.func}>Show/Hide</button>
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
    // - names (string, or array of string): The names of staves to render.
    //
    // If "names" is a string, this component renders a Staff. If "names" is an array of strings,
    // this component renders a StaffGroup with each string as a contained Staff.

    propTypes: {
        names: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.arrayOf(React.PropTypes.string)
        ]).isRequired
    },
    render: function() {
        if ('string' === typeof this.props.names) {
            return (
                <li>{this.props.names}</li>
            );
        } else {
            return (
                <li><ul>
                    {this.props.names.map(name =>
                        <li key={name.toLowerCase()}>{name}</li>
                    )}
                </ul></li>
            );
        }
    }
})


var PartsList = React.createClass({
    render: function() {
        let partsList = [
            ['Flauto piccolo', 'Flauto I', 'Flauto II'],
            ['Oboe I', 'Oboe II', 'Corno ingelese'],
            ['Clarinetto in B I', 'Clarinetto in B II', 'Clarinetto basso in B'],
            ['Fagotto I', 'Fagotto II', 'Contrafagotto'],
            ['Corno in F I', 'Corno in F II', 'Corno in F III', 'Corno in F IV'],
            ['Tromba in B I', 'Tromba in B II', 'Tromba in B III'],
            ['Trombone I', 'Trombone II', 'Trombone III'],
            ['Timpani I', 'Timpani II'],
            'Stahlstäbe',
            'Triangolo',
            '2 Arpe',
            ['Violino I', 'Violino II'],
            'Viola',
            'Violoncello',
            'Contrabasseo'
        ];

        return (
            <ul id="scorestructure-instruments">
                {partsList.map(function(parts, index) {
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
                    <ShowOrHideButton func={this.showOrHide}/>
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
                        <Changeset date={changeset.date} message={changeset.message}/>
                    )}
                </ul>
            </div>
        );
    }
});


var CollaboratorList = React.createClass({
    render: function() {
        let christopherChangesets = [
            {date: '2015-10-06', message: 'swapped outer voices'},
            {date: '2015-09-14', message: 'corrected whatever blah'},
            {date: '2014-12-22', message: 'who let the dogs out?'}
        ];
        let gloriaChangesets = [
            {date: '2015-10-09', message: 'added some notes'},
            {date: '2015-10-08', message: 'put in some stuff'},
            {date: '2015-05-05', message: 'clean up WenXuan\'s noodles'}
        ];
        let wenxuanChangesets = [
            {date: '2015-05-07', message: '小心點'},
            {date: '2015-05-04', message: '我买了面条'},
            {date: '2014-12-20', message: '狗唱歌'}
        ];

        return (
            <div id="ncoda-collaborators-list">
                <Collaborator name='Christopher Antila' changesets={christopherChangesets}/>
                <Collaborator name='Gloria Steinem' changesets={gloriaChangesets}/>
                <Collaborator name='卓文萱' changesets={wenxuanChangesets}/>
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
                    <ShowOrHideButton func={this.showOrHide}/>
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
        onClick: React.PropTypes.func.isRequired
    },
    render: function() {
        return (
            <article className="ncoda-mei-section" id={`section-${this.props.id}`} onClick={this.props.onClick}>
                <header>{this.props.name}</header>
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
                    />
                    <Section
                        id="b"
                        name="B"
                        lastUpdated={bLastUpdated}
                        pathToImage="../../structureview_mock/sectionB.png"
                        onClick={this.props.openContextMenu}
                    />
                    <Section
                        id="ap"
                        name={"A\u2032"}
                        lastUpdated={aLastUpdated}
                        pathToImage="../../structureview_mock/sectionA.png"
                        onClick={this.props.openContextMenu}
                    />
                    <Section
                        id="c"
                        name="C"
                        lastUpdated={cLastUpdated}
                        pathToImage="../../structureview_mock/sectionC.png"
                        onClick={this.props.openContextMenu}
                    />
                    <Section
                        id="app"
                        name={"A\u2032\u2032"}
                        lastUpdated={aLastUpdated}
                        pathToImage="../../structureview_mock/sectionA.png"
                        onClick={this.props.openContextMenu}
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
