// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/structure_view.js
// Purpose:                React components for StructureView.
//
// Copyright (C) 2016 Christopher Antila, Sienna M. Wood
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

import {Button, Breadcrumb, Dropdown, Icon, Image, List, ListItem, Nav, NavItem, Panel} from 'amazeui-react';
import {Immutable} from 'nuclear-js';
import React from 'react';
import {Link} from 'react-router';

import {OffCanvas} from './generics';
import getters from '../nuclear/getters';
import log from '../util/log';
import reactor from '../nuclear/reactor';
import signals from '../nuclear/signals';


// when we get a datestring from Lychee, we need to multiply it by 1000 for JavaScript
const DATE_MULTIPLIER = 1000;


/** HeaderField: Subcomponent of HeaderList, a single MEI header.
 *
 * @param {string} name - The header's display name.
 * @param {string} value - The header's value.
 */
const HeaderField = React.createClass({
    propTypes: {
        name: React.PropTypes.string,
        value: React.PropTypes.string,
    },
    getDefaultProps() {
        return {name: '', value: ''};
    },
    handleEdit() {
        signals.emitters.dialogueBoxShow({
            type: 'question',
            message: 'Please enter a new value for the field',
            callback: (value) => signals.emitters.changeHeader(this.props.name, value),
        });
    },
    handleDelete(event) {
        event.stopPropagation();
        signals.emitters.removeHeader(this.props.name);
    },
    render() {
        const display = `${this.props.name}: ${this.props.value}`;
        return (
            <ListItem>
                <Button onClick={this.handleDelete} amStyle="danger" className="header-button">
                    <Icon icon="minus-circle"/>
                </Button>
                <Button onClick={this.handleEdit} amStyle="warning" className="header-button">
                    <Icon icon="pencil"/>
                </Button>
                {display}
            </ListItem>
        );
    },
});


/** HeaderList: Subcomponent of HeaderBar, the actual list of headers.
 *
 * State
 * -----
 * @param {ImmutableJS.Map} headers - The "flat" list of MEI headers.
 */
const HeaderList = React.createClass({
    mixins: [reactor.ReactMixin],
    getDataBindings() {
        return {headers: getters.headersFlat};
    },
    handleAddHeader() {
        log.error('Adding a header is not implemented yet.');
    },
    render() {
        return (
            <List>
                {this.state.headers.map((value, name) =>
                    <HeaderField key={name} name={name} value={value}/>
                ).toArray()}
                <ListItem>
                    <Button onClick={this.handleAddHeader} amStyle="success">
                        <Icon icon="plus-circle"/>
                    </Button>
                </ListItem>
            </List>
        );
    },
});


/** HeaderBar: In the top-left corner, this shows a list of the MEI headers.
 *
 * State
 * -----
 * @param {bool} showHeaderList - Whether the list of headers is expanded.
 */
const HeaderBar = React.createClass({
    getInitialState() {
        return {showHeaderList: false};
    },
    showOrHide() {
        this.setState({showHeaderList: !this.state.showHeaderList});
    },
    render() {
        let headerList;
        if (this.state.showHeaderList) {
            headerList = <HeaderList/>;
        }

        return (
            <div className="nc-strv-menu nc-strv-menu-tl">
                <div className="header">
                    <ShowOrHideButton
                        func={this.showOrHide}
                        expands="down"
                        isShown={this.state.showHeaderList}
                    />
                    {`Header Bar`}
                </div>
                {headerList}
            </div>
        );
    },
});


/** AnalysisViewGraph: Subcomponent of AnalysisView, the analysis graph itself.
 */
const AnalysisViewGraph = React.createClass({
    render() {
        return (
            <p>
                {`Oh, awkward, this is just a placeholder... yeah, sorry about that.`}
            </p>
        );
    },
});


/** AnalysisView: In the top-right corner, the "expanded section view" analytic graph.
 *
 * State
 * -----
 * @param {boolean} showGraph - Whether the graph is currently displayed.
 */
const AnalysisView = React.createClass({
    getInitialState() {
        return {showGraph: false};
    },
    showOrHide() {
        this.setState({showGraph: !this.state.showGraph});
    },
    render() {
        let graph;
        if (this.state.showGraph) {
            graph = <AnalysisViewGraph/>;
        }

        return (
            <div className="nc-strv-menu nc-strv-menu-tr">
                <div className="header">
                    {`Analysis Graph`}
                    <ShowOrHideButton func={this.showOrHide} expands="down" isShown={this.state.showGraph}/>
                </div>
                {graph}
            </div>
        );
    },
});


/** ShowOrHidebutton: goes on a corner-menu to toggle whether it is shown.
 *
 * Props
 * -----
 * @param {string} expands - The direction this corner-menu expands (up, down, left, right).
 * @param {func} func - REQUIRED: This function is called to toggle whether the corner-menu is shown.
 * @param {bool} isShown - Whether the corner-menu is currently expanded (shown).
 */
const ShowOrHideButton = React.createClass({
    propTypes: {
        expands: React.PropTypes.oneOf(['up', 'down', 'left', 'right', 'expand']),
        func: React.PropTypes.func.isRequired,
        isShown: React.PropTypes.bool,
    },
    getDefaultProps() {
        return {expands: 'expand'};
    },
    handleClick() {
        this.props.func();
    },
    render() {
        let className;

        if ('expand' === this.props.expands) {
            className = 'expand';
        }
        else if (false === this.props.isShown) {
            // the chevron points in the direction of this.props.expands
            className = `chevron-${this.props.expands}`;
        }
        else if (true === this.props.isShown) {
            // the chevron points opposite the direction of this.props.expands
            switch (this.props.expands) {
            case 'down':
                className = 'chevron-up';
                break;
            case 'left':
                className = 'chevron-right';
                break;
            case 'right':
                className = 'chevron-left';
                break;
            case 'up':
            default:
                className = 'chevron-down';
            }
        }
        else {
            className = 'expand';
        }

        return (
            <Button amSize="xs" onClick={this.handleClick}>
                <Icon icon={className}/>
            </Button>
        );
    },
});


/** StaffGroupOrStaff: Subcomponent of PartsList, which renders the data for a part or group of them.
 *
 * This component calls itself recursively to deal with nested <staffGroup> elements
 *
 * Props
 * -----
 * @param {ImmutableJS.List or ImmutableJS.Map} names - Names of the staves to show.
 */
const StaffGroupOrStaff = React.createClass({
    propTypes: {
        names: React.PropTypes.oneOfType([
            React.PropTypes.instanceOf(Immutable.Map),
            React.PropTypes.instanceOf(Immutable.List),
        ]).isRequired,
    },
    render() {
        if (Immutable.Map.isMap(this.props.names)) {
            return (
                <ListItem>{this.props.names.get('label')}</ListItem>
            );
        }

        return (
            <ListItem>
                <List>
                    {this.props.names.map((names, index) =>
                        <StaffGroupOrStaff key={index} names={names}/>
                    )}
                </List>
            </ListItem>
        );
    },
});


/** PartsList: Subcomponent of PartsList, the actual content.
 *
 * Props
 * -----
 * @param {ImmutableJS.List} sections - Data about <section> elements at a given hierarchic level,
 *     in the format provided by Lychee's "document-outbound" converter.
 *
 * Data from the sections are given as a prop, rather than as state, so that this component can
 * render itself recursively for nested sections.
 */
const PartsList = React.createClass({
    propTypes: {
        sections: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    },
    getInitialState() {
        return {showThing: false, selectedID: ''};
    },
    handleShowPanel(event) {
        event.stopPropagation();
        this.setState({showThing: true, selectedID: event.target.getAttribute('data-sectID')});
    },
    handleHidePanel(event) {
        this.setState(this.getInitialState());
        event.stopPropagation();
        event.preventDefault();
    },
    render() {
        // TODO: add a <buttonN> in the <NavItem>

        let offCanvasContents;

        if (this.state.selectedID) {
            if (this.props.sections.hasIn([this.state.selectedID, 'staffGrp'])) {
                offCanvasContents = (
                    <List>
                        {this.props.sections.getIn([this.state.selectedID, 'staffGrp']).map((parts, index) =>
                            <StaffGroupOrStaff key={index} names={parts}/>
                        )}
                    </List>
                );
            }
            else {
                offCanvasContents = <PartsList sections={this.props.sections.getIn([this.state.selectedID, 'sections'])}/>;
            }
        }

        return (
            <div className="nc-strv-partslist-container">
                <Nav>
                    {this.props.sections.get('score_order').map((sectID, index) =>
                        <NavItem key={index} onClick={this.handleShowPanel} data-sectID={sectID}>
                            {`Section ${this.props.sections.getIn([sectID, 'label'])} >`}
                        </NavItem>
                    )}
                </Nav>
                <OffCanvas showContents={this.state.showThing} handleHide={this.handleHidePanel}>
                    {offCanvasContents}
                </OffCanvas>
            </div>
        );
    },
});


/** StavesStructure: In the bottom-left corner, this shows the staves in the score/section.
 *
 * State
 * -----
 * @param {boolean} showParts - Whether the contents are currently displayed.
 * @param {ImmutableJS.Map} sections - Data from the "sections" getter.
 */
const StavesStructure = React.createClass({
    mixins: [reactor.ReactMixin],
    getDataBindings() {
        return {sections: getters.sections};
    },
    getInitialState() {
        return {showParts: false};
    },
    showOrHide() {
        this.setState({showParts: !this.state.showParts});
    },
    render() {
        let sizeStyle;
        let partsList;
        if (this.state.showParts) {
            partsList = <PartsList sections={this.state.sections}/>;
            sizeStyle = {height: '100%', width: '100%'};
        }

        return (
            <div className="nc-strv-menu nc-strv-menu-bl" id="nc-strv-staves" style={sizeStyle}>
                <div className="header">
                    <ShowOrHideButton func={this.showOrHide} expands="up" isShown={this.state.showParts}/>
                    {`Staves Structure`}
                </div>
                {partsList}
            </div>
        );
    },
});


/** Changeset: Subcomponent of Collaborator, showing data about a single changeset.
 *
 * Props
 * -----
 * @param {string} date - The date of the changeset as it should be displayed.
 * @param {string} message - The message associated with the changeset.
 */
const Changeset = React.createClass({
    propTypes: {
        date: React.PropTypes.string.isRequired,
        message: React.PropTypes.string.isRequired,
    },
    render() {
        let message = this.props.message;
        if (message.indexOf('\n') > -1) {
            message = message.slice(0, message.indexOf('\n'));
        }

        return (
            <ListItem>
                <time dateTime={this.props.date}>{this.props.date}</time>
                {`: ${message}`}
            </ListItem>
        );
    },
});


/** Collaborator: Subcomponent of CollaboratorList, showing the changesets of a single contributor.
 *
 * Props
 * -----
 * @param {ImmutableJS.List of str} changesets - The commit hash IDs of contributor's changesets.
 * @param {string} name - The contributor's display name.
 * @param {int} numToShow - An optional maximum number of changesets to show for this user. If omitted,
 *     the default is to show the most recent three changesets.
 *
 * State
 * -----
 * @param {ImmutableJS.List} revlog - Data from this document's Mercurial revlog, as per the
 *     "vcsChangesets" getter.
 */
const Collaborator = React.createClass({
    mixins: [reactor.ReactMixin],
    getDataBindings() {
        return {revlog: getters.vcsChangesets};
    },
    propTypes: {
        changesets: React.PropTypes.instanceOf(Immutable.List).isRequired,
        name: React.PropTypes.string.isRequired,
        numToShow: React.PropTypes.number,
    },
    getDefaultProps() {
        return {numToShow: 3};
    },
    render() {
        // NOTE: in this function, "this.state.revlog" is all the changesets in the repository, and
        //       "this.props.changesets" is the changeset IDs of this user

        let hashes = this.props.changesets;
        if (hashes.size > this.props.numToShow) {
            hashes = hashes.slice(-1 * this.props.numToShow);
        }

        // TODO: once we have better user IDs, we'll have to take their avatars from The Web
        let imgSrc = 'img/generic_user.png';
        switch (this.props.name) {
        case '卓文萱':
            imgSrc = 'img/sample_repo_avatars/genie.jpg';
            break;
        case 'Fortitude Johnson':
            imgSrc = 'img/sample_repo_avatars/fortitude.jpg';
            break;
        case 'Honoré de Balzac':
            imgSrc = 'img/sample_repo_avatars/honoré.jpg';
            break;
        case 'Danceathon Smith':
            imgSrc = 'img/sample_repo_avatars/danceathon.jpg';
            break;
        case 'Gloria Steinem':
            imgSrc = 'img/sample_repo_avatars/gloria.jpg';
            break;
        case 'Christopher Antila':
            imgSrc = 'img/sample_repo_avatars/christopher.jpg';
        }

        return (
            <li className="am-comment">
                <img src={imgSrc} alt="" className="am-comment-avatar" width="48" height="48"/>
                <div className="am-comment-main">
                    <header className="am-comment-hd">
                        <div className="am-comment-meta">
                            <div className="am-comment-author">
                                {this.props.name}
                            </div>
                        </div>
                    </header>
                    <div className="am-comment-bd">
                        <List>
                            {hashes.map((hash) => {
                                const theDate = new Date();
                                theDate.setTime(DATE_MULTIPLIER * this.state.revlog.get(hash).get('date'));
                                return (
                                    <Changeset
                                        key={hash}
                                        date={theDate.toDateString()}
                                        message={this.state.revlog.get(hash).get('description')}
                                    />
                                );
                            })}
                        </List>
                    </div>
                </div>
            </li>
        );
    },
});


/** CollaboratorList: Subcomponent of Collaboration, the actual list of contributors to the score.
 *
 * State
 * -----
 * @param {ImmutableJS.List} users - The contributors to this score, in the format described for the
 *     "vcsUsers" getter.
 */
const CollaboratorList = React.createClass({
    mixins: [reactor.ReactMixin],
    getDataBindings() {
        return {users: getters.vcsUsers};
    },
    render() {
        return (
            <ul className="am-comments-list">
                {this.state.users.map((val, key) =>
                    <Collaborator key={key} name={val.get('name')} changesets={val.get('changesets')}/>
                )}
            </ul>
        );
    },
});


/** Collaboration: in the bottom-right, an overview of the people who have worked on a score.
 *
 * State
 * -----
 * @param {bool} showCollaborators - Whether to display this component's contents.
 */
const Collaboration = React.createClass({
    getInitialState() {
        return {showCollaborators: false};
    },
    showOrHide() {
        this.setState({showCollaborators: !this.state.showCollaborators});
    },
    render() {
        let collabList;
        if (this.state.showCollaborators) {
            collabList = <CollaboratorList/>;
        }

        return (
            <div className="nc-strv-menu nc-strv-menu-br" id="nc-strv-collaboration">
                <div className="header">
                    {`Collaborators`}
                    <ShowOrHideButton
                        func={this.showOrHide}
                        expands="up"
                        isShown={this.state.showCollaborators}
                    />
                </div>
                {collabList}
            </div>
        );
    },
});


/** SectionContextMenu: Subcomponent of Section, the menu when you click on the button.
 *
 * Props:
 * ------
 * @param {bool} hasSubsections - Whether this Section has child Sections. Defaults to false.
 * @param {Element} section - The React element to use as the "title" of this Dropdown element.
 * @param {string} name - Optional. This section's name.
 */
const SectionContextMenu = React.createClass({
    propTypes: {
        hasSubsections: React.PropTypes.bool,
        name: React.PropTypes.string,
        section: React.PropTypes.element.isRequired,
        sectionID: React.PropTypes.string.isRequired,
    },
    getDefaultProps() {
        return {hasSubsections: false};
    },
    /** Move the SectionCursor to this <section>. */
    cursorToThis() {
        signals.emitters.moveSectionCursor([this.props.sectionID]);
    },
    render() {
        let name = 'This Section';
        if (this.props.name) {
            name = `Section ${this.props.name}`;
        }

        let subsections;
        const thisSection = [<Dropdown.Item header key="a">{name}</Dropdown.Item>];
        if (this.props.hasSubsections) {
            subsections = [
                <Dropdown.Item key="b" header>{`Subsections`}</Dropdown.Item>,
                <Dropdown.Item key="c" onClick={this.cursorToThis}>{`Zoom in on Subsections`}</Dropdown.Item>,
                <Dropdown.Item key="d">{`Take all Subsections to CodeScoreView`}</Dropdown.Item>,
            ];
        }
        else {
            thisSection.push(
                <li key="e">
                    <Link to="/codescore" onClick={this.cursorToThis}>
                        {`Take to CodeScoreView`}
                    </Link>
                </li>
            );
        }

        return (
            <Dropdown title={this.props.section}>
                {subsections}
                {thisSection}
            </Dropdown>
        );
    },
});


/** Section: Subcomponent of ActiveSections, the representation of an actual <section>.
 *
 * Props
 * -----
 * @param {string} colour - If there is a section colour, put the CSS-compatible string here.
 * @param {bool} hasSubsections - Whether this Section has child Sections. Defaults to false.
 * @param {string} id - REQUIRED: this section's "id"
 * @param {Object} lastUpdated - The "name" and "date" of this section's most recent changeset.
 * @param {string} name - REQUIRED: this section's "name"
 * @param {string} pathToImage - The path to an image that represents this section.
 */
const Section = React.createClass({
    propTypes: {
        colour: React.PropTypes.string,
        hasSubsections: React.PropTypes.bool,
        id: React.PropTypes.string.isRequired,
        lastUpdated: React.PropTypes.shape({
            name: React.PropTypes.string,
            date: React.PropTypes.instanceOf(Date),
        }),
        name: React.PropTypes.string.isRequired,
        pathToImage: React.PropTypes.string,
    },
    handleDragStart(event) {
        event.dataTransfer.setData('text/plain', this.props.id);
    },
    render() {
        // TODO: figure out how to re-enable this when you deal with Julius issue #27
        // let headerStyleAttr = {};
        // if (this.props.colour) {
        //     headerStyleAttr = {background: this.props.colour};
        // }

        const header = (
            <header>
                <h3>{this.props.name}</h3>
                <div className="nc-backgrounder"/>
            </header>
        );

        let image;
        if (this.props.pathToImage) {
            image = <Image alt="" src={this.props.pathToImage}/>;
        }
        else {
            image = <Icon icon="music" button amStyle="primary" className="am-center"/>;
        }

        let footer;
        if (this.props.lastUpdated) {
            footer = (
                <footer>
                    <address>{this.props.lastUpdated.name}</address>
                    <time dateTime={this.props.lastUpdated.date.toISOString()}>
                        {this.props.lastUpdated.date.toDateString()}
                    </time>
                </footer>
            );
        }

        const sectionToRender = (
            <Panel header={header} footer={footer}>
                {image}
            </Panel>
        );

        return (
            <section
                className="nc-strv-section"
                id={`section-${this.props.id}`}
                onClick={this.handleClick}
                draggable={true}
                onDragStart={this.handleDragStart}
            >
                <SectionContextMenu
                    hasSubsections={this.props.hasSubsections}
                    name={this.props.name}
                    section={sectionToRender}
                    sectionID={this.props.id}
                />
            </section>
        );
    },
});


/** SectionDropTarget: Subcomponent of ActiveSections, used when drag-and-drop changing <section> order
 *
 * Props:
 * ------
 * @param {Number} moveToIndex - When a <section> is dropped on this SectionDropTarget, this integer
 *     indicates the position the <section> should be moved to. For example, if "moveToIndex" is
 *     zero, a <section> dropped on this SectionDropTarget will become the first <section> in the
 *     active score.
 */
const SectionDropTarget = React.createClass({
    propTypes: {
        moveToIndex: React.PropTypes.number.isRequired,
    },
    getInitialState() {
        return {dragOver: false};
    },
    handleDrop(event) {
        this.setState({dragOver: false});
        signals.emitters.changeSectionOrder(
            event.dataTransfer.getData('text/plain'),
            this.props.moveToIndex
        );
    },
    handleDragEnter(event) {
        this.setState({dragOver: true});
        event.preventDefault();
    },
    handleDragLeave(){
        this.setState({dragOver: false});
    },
    handleDragOver(event) {
        event.preventDefault();
    },
    render() {
        let className = 'nc-strv-drop-target';
        if (this.state.dragOver) {
            className = 'nc-strv-drop-target-active';
        }

        return (
            <div
                className={className}
                onDrop={this.handleDrop}
                onDragEnter={this.handleDragEnter}
                onDragLeave={this.handleDragLeave}
                onDragOver={this.handleDragOver}
            />
        );
    },
});


/** ActiveSections: the list of <section>s currently active in the <score>.
 *
 * State
 * -----
 * @param {ImmutableJS.List} changesets - From the NuclearJS "vcsChangesets" getter.
 * @param {ImmutableJS.List} cursor - From the NuclearJS "sectionCursorFriendly" getter.
 * @param {ImmutableJS.Map} sections - From the NuclearJS "sections" getter.
 */
const ActiveSections = React.createClass({
    mixins: [reactor.ReactMixin],
    getDataBindings() {
        return {
            changesets: getters.vcsChangesets,
            cursor: getters.sectionCursorFriendly,
            sections: getters.sections,
        };
    },
    render() {
        let activeSectionsTitle = 'Active Sections';
        let order;
        const constOrder = this.state.sections.get('score_order');
        let sections = this.state.sections;
        let sectionElements;
        if (constOrder) {
            if (constOrder.size === 0) {
                sectionElements = <p>{`This document has no sections.`}</p>;
            }

            else {
                // interleave targets for drag-and-drop <section> reordering
                order = ['dropTarget'];
                for (const sectID of constOrder) {
                    order.push(sectID, 'dropTarget');
                }

                if (this.state.cursor.count() > 0) {
                    let section = this.state.sections.getIn(this.state.cursor);
                    if (!section.has('sections')) {
                        // If the cursor points to a <section> without subsections, we'll show that
                        // section's parent.
                        section = this.state.sections.getIn(this.state.cursor.skipLast(2));
                    }
                    if (section.get('label')) {
                        activeSectionsTitle = `Section ${section.get('label')}`;
                    }
                    order = section.getIn(['sections', 'score_order']);
                    sections = section.get('sections');
                }

                if (order) {
                    // If "order" is undefined, the cursor is (temporarily?) point to a <section>
                    // that has no subsections. This will be fixed in a moment by the StructureView
                    // component, so we'll just wait.
                    sectionElements = order.map((sectId, i) => {
                        if (sectId === 'dropTarget') {
                            return <SectionDropTarget key={i} moveToIndex={i / 2}/>;
                        }

                        const lastHash = sections.getIn([sectId, 'last_changeset']);
                        let lastUpdated;
                        if (this.state.changesets.has(lastHash)) {
                            let name = this.state.changesets.getIn([lastHash, 'user']);
                            name = name.slice(0, name.indexOf(' <'));  // TODO: this is not foolproof

                            const date = new Date();
                            date.setTime(this.state.changesets.getIn([lastHash, 'date']) * DATE_MULTIPLIER);

                            lastUpdated = {
                                name: name,
                                date: date,
                            };
                        }
                        let hasSubsections = false;
                        if (sections.getIn([sectId, 'sections'])) {
                            hasSubsections = true;
                        }

                        return (
                            <Section
                                key={sectId}
                                id={sectId}
                                name={sections.getIn([sectId, 'label'])}
                                lastUpdated={lastUpdated}
                                hasSubsections={hasSubsections}
                            />
                        );
                    });
                }
                else {
                    sectionElements = <Icon icon="circle-o-notch" spin amSize="lg" className="am-text-primary"/>;
                }
            }
        }
        else {
            sectionElements = <Icon icon="circle-o-notch" spin amSize="lg" className="am-text-primary"/>;
        }

        return (
            <article className="nc-active-sections">
                <header>
                    <h2>{activeSectionsTitle}</h2>
                </header>
                <div>
                    {sectionElements}
                </div>
            </article>
        );
    },
});


/** StructureBreadCrumbs: TODO
 */
const StructureBreadCrumbs = React.createClass({
    mixins: [reactor.ReactMixin],
    getDataBindings() {
        return {cursor: getters.sectionCursor, sections: getters.sections};
    },
    handleCursorToRoot() {
        signals.emitters.moveSectionCursor(['/']);
    },
    render() {
        // TODO: the am-active thing

        // <Breadcrumb.Item><button>{`A`}</button></Breadcrumb.Item>
        // <Breadcrumb.Item className="am-active"><button>{`B`}</button></Breadcrumb.Item>

        const cursor = this.state.cursor;
        let sections = this.state.sections;
        const innerSections = [];
        if (sections.size > 0) {
            for (const sectID of cursor) {
                innerSections.push(
                    <Breadcrumb.Item key={sectID}>
                        <button>{sections.getIn([sectID, 'label'])}</button>
                    </Breadcrumb.Item>
                );
                sections = sections.getIn([sectID, 'sections']);
            }
        }

        return (
            <div className="nc-strv-breadcrumbs">
                <Breadcrumb slash>
                    <Breadcrumb.Item>
                        <button onClick={this.handleCursorToRoot}>
                            <Icon icon="sitemap"/>{`Active Sections`}
                        </button>
                    </Breadcrumb.Item>
                    {innerSections}
                    <Breadcrumb.Item><Icon icon="arrow-down"/></Breadcrumb.Item>
                </Breadcrumb>
            </div>
        );
    },
});


const StructureView = React.createClass({
    mixins: [reactor.ReactMixin],
    getDataBindings() {
        return {
            sections: getters.sections,
            sectionCursor: getters.sectionCursorFriendly,
        };
    },
    componentWillMount() {
        signals.emitters.registerOutboundFormat('vcs', 'StructureView', false);
        signals.emitters.registerOutboundFormat('document', 'StructureView', false);
    },
    componentDidMount() {
        // If the document cursor is set to a section that doesn't have subsections, we'll set it
        // one level higher. This prevents weird problems in subcomponents.
        this.checkForValidCursor(this.state.sections, this.state.sectionCursor);
    },
    componentWillUpdate(nextProps, nextState) {
        if (nextState.sections !== this.state.sections
            || nextState.sectionCursor !== this.state.sectionCursor) {
            this.checkForValidCursor(nextState.sections, nextState.sectionCursor);
        }
    },
    componentWillUnmount() {
        signals.emitters.unregisterOutboundFormat('vcs', 'StructureView');
        signals.emitters.unregisterOutboundFormat('document', 'StructureView');
    },
    checkForValidCursor(sections, cursor) {
        if (sections.size === 0) {
            return;
        }
        const section = sections.getIn(cursor);
        if (!section.has('score_order')) {
            signals.emitters.moveSectionCursor(['..']);
        }
    },
    render() {
        return (
            <div id="nc-strv-frame">
                <div id="nc-strv-corner-menus">
                    <HeaderBar/>
                    <AnalysisView/>
                    <StavesStructure/>
                    <Collaboration/>
                    <StructureBreadCrumbs/>
                </div>
                <div id="nc-strv-view">
                    <ActiveSections/>
                </div>
            </div>
        );
    },
});

export default StructureView;
