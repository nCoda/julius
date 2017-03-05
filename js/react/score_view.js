// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/score_view.js
// Purpose:                React components for ScoreView module.
//
// Copyright (C) 2016 Andrew Horwitz, Sienna M. Wood
// Copyright (C) 2017 Christopher Antila, Sienna M. Wood
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

import Immutable from 'immutable';
import React from 'react';
import { connect } from 'react-redux';

import { emitters as signals } from '../nuclear/signals';
import { getters as docGetters } from '../stores/document';
import { getters as vrvGetters } from '../stores/verovio';
import { VidaView } from '../lib/vida';

import PDFViewer from './pdf_viewer';
import { Tabs } from 'amazeui-react';

export const ScoreView = React.createClass({
    getInitialState() {
        return {
            key: '1',
        };
    },
    handleSelect(key) {
        this.setState({ key });
    },
    render() {
        const pdf = 'js/react/tests/dummy_multi.pdf';

        return (
            <Tabs defaultActiveKey={this.state.key} onSelect={this.handleSelect} justify>
                <Tabs.Item eventKey="1" title="Verovio">
                    <VerovioView />
                </Tabs.Item>
                <Tabs.Item eventKey="2" title="PDF">
                    <PDFViewer file={pdf} />
                </Tabs.Item>
            </Tabs>
        );
    },
});


const ICON_CLASSES = {
    nextPage: 'am-icon-arrow-right',
    prevPage: 'am-icon-arrow-left',
    zoomIn: 'am-icon-plus-circle',
    zoomOut: 'am-icon-minus-circle',
};


/** VerovioViewUnwrapped: React container for Vida6.
 *
 * Props
 * -----
 * @param {VidaController} controller - The VidaController for our VidaView.
 * @param {ImmutableList} cursor - The document cursor.
 * @param {string} section - The Verovio MEI <section> to render.
 *
 * State
 * -----
 * @param {VidaView} view - The VidaView instance.
 */
export const VerovioViewUnwrapped = React.createClass({
    displayName: 'VerovioView',

    propTypes: {
        controller: React.PropTypes.object.isRequired,
        cursor: React.PropTypes.instanceOf(Immutable.List),
        section: React.PropTypes.string.isRequired,
    },

    getDefaultProps() {
        return {section: ''};
    },

    getInitialState() {
        return {view: null};
    },

    componentWillMount() {
        signals.registerOutboundFormat('verovio', 'ScoreView');
        if (!this.props.section) {
            signals.lyGetSectionById(this.props.cursor.last());
        }
    },

    componentDidMount() {
        if (this.props.controller && this.refs.verovioFrame) {
            const newView = new VidaView({
                parentElement: this.refs.verovioFrame,
                controller: this.props.controller,
                iconClasses: ICON_CLASSES,
            });

            // set the initial document, if we have one
            if (this.props.section) {
                newView.refreshVerovio(this.props.section);
            }

            this.setState({view: newView});
        }
        else {
            console.error('ScoreView: missing VidaController or the <div>');
        }
    },

    componentWillReceiveProps(nextProps) {
        if (this.props.section !== nextProps.section && this.state.view) {
            this.state.view.refreshVerovio(nextProps.section);
        }
    },

    shouldComponentUpdate() {
        // NOTE: the answer is always "no" because Vida manages the contents
        return false;
    },

    componentWillUnmount() {
        signals.unregisterOutboundFormat('verovio', 'ScoreView');
        if (this.state.view) {
            this.state.view.destroy();
            this.setState({view: null});
        }
    },

    render() {
        return <div className="ncoda-verovio" ref="verovioFrame"/> ;
    },
});


const VerovioView = connect((state) => {
    return {
        controller: vrvGetters.vidaController(state),
        cursor: docGetters.cursor(state),
        section: vrvGetters.current(state),
    };
})(VerovioViewUnwrapped);

export default ScoreView;
