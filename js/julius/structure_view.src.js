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


var SectionMenu = React.createClass({
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
                <SectionMenu/>
            </div>
        );
    }
});


var PartsList = React.createClass({
    render: function() {
        return (
            <ul id="scorestructure-instruments">
                <li><ul>
                    <li>Flauto poccolo</li>
                    <li>Flauto I</li>
                    <li>Flauto II</li>
                </ul></li>
                <li><ul>
                    <li>Oboe I</li>
                    <li>Oboe II</li>
                    <li>Corno inglese</li>
                </ul></li>
                <li><ul>
                    <li>Clarinetto in B I</li>
                    <li>Clarinetto in B II</li>
                    <li>Clarinetto basso in B</li>
                </ul></li>
                <li><ul>
                    <li>Fagotto I</li>
                    <li>Fagotto II</li>
                    <li>Contrafagotto</li>
                </ul></li>
                <li><ul>
                    <li>Corno in F I</li>
                    <li>Corno in F II</li>
                    <li>Corno in F III</li>
                    <li>Corno in F IV</li>
                </ul></li>
                <li><ul>
                    <li>Tromba in B I</li>
                    <li>Tromba in B II</li>
                    <li>Tromba in B III</li>
                </ul></li>
                <li><ul>
                    <li>Trombone I</li>
                    <li>Trombone II</li>
                    <li>Trombone III</li>
                </ul></li>
                <li><ul>
                    <li>Timpani I</li>
                    <li>Timpani II</li>
                </ul></li>
                <li>Stahlstäbe</li>
                <li>Triangolo</li>
                <li>2 Arpe</li>
                <li><ul>
                    <li>Violino I</li>
                    <li>Violino II</li>
                </ul></li>
                <li>Viola</li>
                <li>Violoncello</li>
                <li>Contrabasso</li>
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


var CollaboratorList = React.createClass({
    render: function() {
        return (
            <div id="ncoda-collaborators-list">
                <div className="ncoda-collaboration-person">
                    <address>Christopher Antila</address>
                    <ul>
                        <li><time dateTime="2015-10-06 17:00">Tuesday</time>: swapped outer voices</li>
                        <li><time dateTime="2015-09-14">September 14th</time>: corrected whatever blah</li>
                        <li><time dateTime="2015-12-22">December 2014</time>: who let the dogs out?</li>
                    </ul>
                </div>
                <div className="ncoda-collaboration-person">
                    <address>Gloria Steinem</address>
                    <ul>
                        <li><time dateTime="2015-10-09">Friday</time>: added some notes</li>
                        <li><time dateTime="2015-10-08">Thursday</time>: put in some stuff</li>
                        <li><time dateTime="2015-05-05">May 5th</time>: clean up WenXuan&apos;s noodles</li>
                    </ul>
                </div>
                <div className="ncoda-collaboration-person">
                    <address>卓文萱</address>
                    <ul>
                        <li><time dateTime="2015-05-07">May 7th</time>: 小心點</li>
                        <li><time dateTime="2015-05-04">May 4th</time>: 我买了面条</li>
                        <li><time dateTime="2014-12-20">December 2014</time>: 狗唱歌</li>
                    </ul>
                </div>
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


var StructureView = React.createClass({
    render: function() {
        return (
            <div className="ncoda-structureview-frame">
                <StructureViewMenus/>
                <div id="ncoda-structureview" className="ncoda-structureview">
                    <StructureViewHeader/>

                    <article className="ncoda-active-sections">
                        <header>
                            Active Score
                        </header>

                        <content>
                            <article className="ncoda-mei-section first-section" id="section-a">
                                <header>
                                    A
                                </header>
                                <div className="ncoda-mei-section-img">
                                    <img src="../../structureview_mock/sectionA.png"/>
                                </div>
                                <footer>
                                    <address>Christopher Antila</address>
                                    <time dateTime="2015-10-06 16:32">Tuesday</time>
                                </footer>
                            </article>

                            <article className="ncoda-mei-section" id="section-b">
                                <header>
                                    B
                                </header>
                                <div className="ncoda-mei-section-img">
                                    <img src="../../structureview_mock/sectionB.png"/>
                                </div>
                                <footer>
                                    <address>Gloria Steinem</address>
                                    <time dateTime="2015-10-09 17:00">Friday</time>
                                </footer>
                            </article>

                            <article className="ncoda-mei-section" id="section-ap">
                                <header>
                                    A&prime;
                                </header>
                                <div className="ncoda-mei-section-img">
                                    <img src="../../structureview_mock/sectionA.png"/>
                                </div>
                                <footer>
                                    <address>Christopher Antila</address>
                                    <time dateTime="2015-10-06 17:00">Tuesday</time>
                                </footer>
                            </article>

                            <article className="ncoda-mei-section" id="section-c">
                                <header>
                                    C
                                </header>
                                <div className="ncoda-mei-section-img">
                                    <img src="../../structureview_mock/sectionC.png"/>
                                </div>
                                <footer>
                                    <address>卓文萱</address>
                                    <time dateTime="2015-05-07 17:00">May 7th</time>
                                </footer>
                            </article>

                            <article className="ncoda-mei-section last-section" id="section-app">
                                <header>
                                    A&prime;&prime;
                                </header>
                                <div className="ncoda-mei-section-img">
                                    <img src="../../structureview_mock/sectionA.png"/>
                                </div>
                                <footer>
                                    <address>Christopher Antila</address>
                                    <time dateTime="2015-10-06 16:32">Tuesday</time>
                                </footer>
                            </article>
                        </content>
                    </article>
                    <StructureViewFooter/>
                </div>
            </div>
        );
    }
});

export default StructureView;
