// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/structure_view.js
// Purpose:                React components for RevisionView.
//
// Copyright (C) 2016 Christopher Antila, Sienna M. Wood, Wei Gao
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
import moment from 'moment';

const RevisionList = React.createClass({
    render() {
        const rawDate= moment(new Date()).format('MMM Do YYYY');

        const d = rawDate.toString();
        const mockData = [
          {msg: 'commit 1  ', author: 'Balzac', date: d, revNumber: '9gfgj4lj4fgf', section: 'A'},
          {msg: 'commit 2  ', author: 'Wei G', date: d, revNumber: '4kjh42lkhl5jl', section: 'B'},
          {msg: 'commit 3  ', author: 'Christopher A', date: d, revNumber: '43kjhkkk3k3kk3', section: 'C'},
        ];

        return (
            <div className="nc-rv-frame">
                <table width="100%" class="am-table am-table-striped">
                    <thead>
                        <tr>
                            <th>DATE</th>
                            <th>MSG</th>
                            <th>REVISION</th>
                            <th>SECTION</th>
                            <th>VIEW DIFF</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockData.map((m, key) =>
                            <Revision date={m.date}
                                      msg={m.msg}
                                      author={m.author}
                                      revNumber={m.revNumber}
                                      section={m.section}/>
                        )}
                  </tbody>
                </table>
            </div>
        );
    },
});

const Revision = React.createClass({
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
export default RevisionList;
