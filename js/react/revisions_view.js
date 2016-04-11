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

import {Badge, List, ListItem} from 'amazeui-react';
import {Immutable} from 'nuclear-js';
import React from 'react';

import getters from '../nuclear/getters';
import reactor from '../nuclear/reactor';
import {emitters as signals} from '../nuclear/signals';


const Revlog = React.createClass({
    propTypes: {
        revlog: React.PropTypes.instanceOf(Immutable.List).isRequired,
    },
    render() {
        return (
            <div className="nc-rv-frame">
                <table width="100%" className="am-table am-table-striped">
                    <thead>
                        <tr>
                            <th>{`Date`}</th>
                            <th>{`Message`}</th>
                            <th>{`Revision`}</th>
                            <th>{`Sections`}</th>
                            <th>{`View`}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.revlog.map((m, key) =>
                            <Changeset key={key}
                                       date={m.get('date')}
                                       msg={m.get('msg')}
                                       author={m.get('author')}
                                       revNumber={m.get('revNumber')}
                                       section={m.get('section')}/>
                        )}
                  </tbody>
                </table>
            </div>
        );
    },
});


const Changeset = React.createClass({
  propTypes: {
      date: React.PropTypes.string.isRequired,
      msg: React.PropTypes.string.isRequired,
      author: React.PropTypes.string.isRequired,
      revNumber: React.PropTypes.string.isRequired,
      section: React.PropTypes.string.isRequired,
  },
    render() {
      return (
          <tr>
              <td>{this.props.date} </td>
              <td>{this.props.author} : {this.props.msg}</td>
              <td><Badge amStyle="success">{this.props.revNumber}</Badge></td>
              <td>{this.props.section}</td>
              <td>checkbox</td>
          </tr>
      );
    },
});


const TextualDiff = React.createClass({
  propTypes: {

  },
    render() {
      return (
        <p> textual diff coming up ... </p>
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
        // tell Lychee we want VCS data
        signals.registerOutboundFormat('vcs', 'RevisionsView', true);
    },
    componentWillUnmount() {
        // tell Lychee we don't need VCS data any more
        signals.unregisterOutboundFormat('vcs', 'RevisionsView');
    },
    render() {
        return <Revlog revlog={this.state.revlog}/>;
    },
});


export default RevlogNuclear;
