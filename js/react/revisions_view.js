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

import {Badge, Button, ButtonGroup, List, ListItem, Nav, NavItem, Panel} from 'amazeui-react';
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
    propTypes: {
        params: React.PropTypes.shape({format: React.PropTypes.string.isRequired}),
    },
    render() {
        const footer = (
            <ButtonGroup>
                <Button>{`View in CodeScoreView`}</Button>
                <Button>{`View in StructureView`}</Button>
                <Button>{`Reset to this Revision`}</Button>
            </ButtonGroup>
        );

        let tempLeftText, tempRightText;

        if (this.props.params.format === 'mei') {
        tempLeftText =
`<mei:measure n="3" xml:id="bRSpLKHj1AmciRevlagX77fH1Pn4OzuZ">
    <mei:layer n="1" xml:id="Pnlw09CayKDdWZ1CTdg61K9tbS7iueqp">
        <mei:note dur="4" oct="3" pname="a" xml:id="Z3fWjWbLurFLehBaNdJrPi8CErBPlgs9"/>
        <mei:note dur="4" oct="3" pname="b" xml:id="VgGGONcE1g25QuShUWBVHaP9OsHlFDKj"/>
        <mei:note dur="4" oct="4" pname="c" xml:id="uWSf385T5iCi79L5qU2IhVCCG1cmQnfg"/>
        <mei:note dur="4" oct="3" pname="a" xml:id="n5QoXB8dG76vKnD9Iq4tiTPF5ggAS1gJz"/>
        <mei:note dur="4" oct="3" pname="b" xml:id="FUjR2DufIzXuJrm26f83yzupMXSQoI7Z"/>
        <mei:note dur="4" oct="4" pname="c" xml:id="n4s0y8ltqjSSfjrnqwBGWDu3m07Vu9F99"/>
    </mei:layer>
</mei:measure>`;
        tempRightText =
`<mei:measure n="3" xml:id="bRSpLKHj1AmciRevlagX77fH1Pn4OzuZ">
    <mei:layer n="1" xml:id="Pnlw09CayKDdWZ1CTdg61K9tbS7iueqp">
        <mei:note dur="4" oct="3" pname="a" xml:id="Z3fWjWbLurFLehBaNdJrPi8CErBPlgs9"/>
        <mei:note dur="4" oct="3" pname="b" xml:id="VgGGONcE1g25QuShUWBVHaP9OsHlFDKj"/>
        <mei:note dur="4" oct="4" pname="c" xml:id="uWSf385T5iCi79L5qU2IhVCCG1cmQnfg"/>
        <mei:note dur="4" oct="3" pname="d" xml:id="n5QoXB8dG24vKnD9Iq4tiTPF5ggAS1gJz"/>
        <mei:note dur="4" oct="3" pname="b" xml:id="FUjR2DufIzXuJrm26f83yzupMXSQoI7Z"/>
        <mei:note dur="4" oct="4" pname="c" xml:id="n4s0y8ltqjSSfjrnqwBGWDu3m07Vu9F99"/>
    </mei:layer>
</mei:measure>`
        }
        else if (this.props.params.format === 'lilypond') {
            tempLeftText = `\\clef "treble"\na,4 b, c a, b, c`;
            tempRightText = `\\clef "bass"\na,4 b, c a, b, c`;
        }
        else {
            console.error('AHHH!');
        }

        return (
            <Panel className="nc-rv-textual" footer={footer}>
                <h2>{`这是一个 ${this.props.params.format} Diff`}</h2>
                <CodeMirror
                    diff={true}
                    leftText={tempLeftText}
                    rightText={tempRightText}
                />
            </Panel>
        );
    },
});


const DiffView = React.createClass({
    propTypes: {
        params: React.PropTypes.shape({revNumber: React.PropTypes.string.isRequired}),
    },
    render() {
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
