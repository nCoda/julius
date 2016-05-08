// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/revisions_view.js
// Purpose:                React components for RevisionsView.
//
// Copyright (C) 2016 Wei Gao, Christopher Antila
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

import {Badge, Button, ButtonGroup, Divider, Input, List, ListItem, Nav, NavItem, Panel} from 'amazeui-react';
import {Immutable} from 'nuclear-js';
import moment from 'moment';
import React from 'react';
import {Link} from 'react-router';

import CodeMirror from './codemirror';
import getters from '../nuclear/getters';
import reactor from '../nuclear/reactor';
import {emitters as signals} from '../nuclear/signals';


const Revlog = React.createClass({
    propTypes: {
        revlog: React.PropTypes.instanceOf(Immutable.List).isRequired,
    },
    render() {
        // to show the revlog with most recent changeset at the top
        const reversed = this.props.revlog.reverse();
        return (
            <table width="100%" className="am-table am-table-striped">
                <thead>
                    <tr>
                        <th>{`Date`}</th>
                        <th>{`Author`}</th>
                        <th>{`Message`}</th>
                        <th>{`Revision`}</th>
                        <th>{`Sections Modified`}</th>
                        <th>{`View`}</th>
                    </tr>
                </thead>
                <tbody>
                    {reversed.map((m, key) =>
                        <Changeset key={key}
                                   date={m.get('date')}
                                   msg={m.get('msg')}
                                   author={m.get('author')}
                                   revNumber={m.get('revNumber')}
                                   section={m.get('section')}/>
                    )}
                </tbody>
            </table>
        );
    },
});


const Changeset = React.createClass({
    propTypes: {
        date: React.PropTypes.number.isRequired,
        msg: React.PropTypes.string.isRequired,
        author: React.PropTypes.string.isRequired,
        revNumber: React.PropTypes.string.isRequired,
        section: React.PropTypes.string.isRequired,
    },
    render() {
        const theDate = moment(this.props.date, 'X');
        return (
            <tr>
                <td>
                    <time dateTime={theDate.format('YYYY-MM-DDTHH:mm')}>
                        {theDate.format('D MMM YYYY, HH:mm')}
                    </time>
                </td>
                <td>{this.props.author}</td>
                <td>{this.props.msg}</td>
                <td><Badge amStyle="success">{this.props.revNumber}</Badge></td>
                <td>{this.props.section}</td>
                <td>
                    <Link className="am-btn am-btn-default" to={`/revisions/diff/${this.props.revNumber}`}>
                        {`View`}
                    </Link>
                </td>
            </tr>
        );
    },
});


const TextualDiff = React.createClass({
    mixins: [reactor.ReactMixin],
    getDataBindings() {
        return {
            revisions: getters.revisions,
            sections: getters.sections,
            sectionCursor: getters.sectionCursor,
        };
    },
    propTypes: {
        params: React.PropTypes.shape({
            format: React.PropTypes.string.isRequired,
            revNumber: React.PropTypes.string.isRequired,
        }),
    },
    componentWillMount() {
        signals.registerOutboundFormat(this.props.params.format, 'TextualDiff', false);
    },
    componentDidMount() {
        // If the document cursor is not set, we need to choose a default.
        const sectID = this.state.sectionCursor.last();
        if (sectID) {
            this.fetchSections(sectID);
        }
        else {
            this.checkForValidCursor(this.state.sections, this.state.sectionCursor);
        }
    },
    componentWillReceiveProps(nextProps) {
        if (nextProps.params.format !== this.props.params.format) {
            signals.unregisterOutboundFormat(this.props.params.format, 'TextualDiff');
            signals.registerOutboundFormat(nextProps.params.format, 'TextualDiff', false);
            // If the document cursor is not set, we need to choose a default.
            const sectID = this.state.sectionCursor.last();
            if (sectID) {
                this.fetchSections(sectID);
            }
            else {
                this.checkForValidCursor(this.state.sections, this.state.sectionCursor);
            }
        }
    },
    componentWillUpdate(nextProps, nextState) {
        // If the document cursor is not set, we need to choose a default.
        if (nextState.sections !== this.state.sections
            || nextState.sectionCursor !== this.state.sectionCursor) {
            const sectID = nextState.sectionCursor.last();
            if (sectID && nextState.sectionCursor.last() !== this.state.sectionCursor.last()) {
                this.fetchSections(sectID);
            }
            else {
                this.checkForValidCursor(nextState.sections, nextState.sectionCursor);
            }
        }
    },
    componentWillUnmount() {
        signals.unregisterOutboundFormat(this.props.params.format, 'TextualDiff');
    },
    checkForValidCursor(sections, cursor) {
        if (sections.size === 0) {
            // the section data aren't loaded yet, so we'll just quit
            return;
        }
        if (cursor.size === 0) {
            signals.moveSectionCursor([sections.get('score_order').get(0)]);
        }
    },
    fetchSections(sectID) {
        if (sectID) {
            const revNum = Number.parseInt(this.props.params.revNumber, 10);
            signals.lyGetSectionById(sectID, revNum);
            signals.lyGetSectionById(sectID, revNum - 1);
        }
    },
    render() {
        const footer = (
            <ButtonGroup>
                <Button disabled>{`View in CodeScoreView`}</Button>
                <Button disabled>{`View in StructureView`}</Button>
                <Button disabled>{`Reset to this Revision`}</Button>
            </ButtonGroup>
        );

        let leftText, rightText = '(loading...)';

        const revNumLeft = (Number.parseInt(this.props.params.revNumber, 10) - 1).toString();
        const revNumRight = this.props.params.revNumber;
        const format = this.props.params.format;
        const sectID = this.state.sectionCursor.last();

        if (this.state.revisions.getIn([revNumLeft, format, sectID])) {
            leftText = this.state.revisions.getIn([revNumLeft, format, sectID]);
        }
        if (this.state.revisions.getIn([revNumRight, format, sectID])) {
            rightText = this.state.revisions.getIn([revNumRight, format, sectID]);
        }

        return (
            <Panel className="nc-rv-textual" footer={footer}>
                <h2>{`DiffView: ${this.props.params.format}`}</h2>
                <CodeMirror
                    diff={true}
                    leftText={leftText}
                    rightText={rightText}
                />
            </Panel>
        );
    },
});


const DiffView = React.createClass({
    mixins: [reactor.ReactMixin],
    getDataBindings() {
        return {
            sections: getters.sections,
            sectionCursor: getters.sectionCursor,
        };
    },
    propTypes: {
        params: React.PropTypes.shape({revNumber: React.PropTypes.string.isRequired}),
    },
    handleSectionSelection(event) {
        signals.moveSectionCursor(['/', event.target.value]);
    },
    render() {
        let sectionOptions;
        if (this.state.sections.get('score_order')) {
            sectionOptions = [];
            for (const sectID of this.state.sections.get('score_order')) {
                sectionOptions.push(
                    <option value={sectID} key={sectID}>
                        {this.state.sections.getIn([sectID, 'label'])}
                    </option>
                );
            }
        }
        else {
            sectionOptions = <option>{`(loading sections)`}</option>;
        }

        return (
            <div>
                <Nav pills>
                    <NavItem><Link to="/revisions">{`Back to Revlog`}</Link></NavItem>
                    <NavItem><Link to={`/revisions/diff/${this.props.params.revNumber}/text/lilypond`}>
                        {`LilyPond Diff`}
                    </Link></NavItem>
                    <NavItem><Link to={`/revisions/diff/${this.props.params.revNumber}/text/mei`}>
                        {`MEI Diff`}
                    </Link></NavItem>
                    <NavItem href="#" disabled>{`ScoreView Diff`}</NavItem>
                </Nav>
                <form className="am-form" target="_blank">
                    <Input
                        type="select"
                        label="Section"
                        labelClassName="am-u-sm-2"
                        wrapperClassName="am-u-sm-10"
                        onChange={this.handleSectionSelection}
                    >
                        {sectionOptions}
                    </Input>
                </form>
                <Divider/>
                {this.props.children}
            </div>
        );
    },
});


/** RevlogNuclear: wrapper for Revlog that connects to NuclearJS for nCoda.
 */
const RevlogNuclear = React.createClass({
    mixins: [reactor.ReactMixin],
    getDataBindings() {
        return {revlog: getters.vcsRevlog};
    },
    componentWillMount() {
        signals.registerOutboundFormat('vcs', 'RevisionsView', false);
        signals.registerOutboundFormat('document', 'RevisionsView', false);
    },
    componentWillUnmount() {
        signals.unregisterOutboundFormat('vcs', 'RevisionsView');
        signals.unregisterOutboundFormat('document', 'RevisionsView');
    },
    render() {
        return <Revlog revlog={this.state.revlog}/>;
    },
});


/** RevisionsView: Top-level container component.
 */
const RevisionsView = React.createClass({
    render() {
        return (
            <div className="nc-rv-frame">
                {this.props.children}
            </div>
        );
    },
});


const FOR_EXPORT = {
    'DiffView': DiffView,
    'RevisionsView': RevisionsView,
    'Revlog': RevlogNuclear,
    'TextualDiff': TextualDiff,
};
export default FOR_EXPORT;
