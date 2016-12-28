// -*- coding: utf-8 -*-
//-------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/ncoda-init.js
// Purpose:                Initializes Julius for nCoda.
//
// Copyright (C) 2016 Christopher Antila, Wei Gao
// Copyright (C) 2017 Christopher Antila
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

// third-party libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { hashHistory, Router, IndexRoute, Route } from 'react-router';

// Create the Redux structure (as early as possible)
import { store } from './stores';

// log!
import log from './util/log';

// Julius React components
import NCoda from './react/ncoda';
import {MainScreen, Colophon} from './react/ncoda';
// import StructureView from './react/structure_view';
import CodeScoreView from './react/code_score_view';
// import revisions from './react/revisions_view';

// Set the default log level and connect to Fujian.
import { actions as metaActions, LOG_LEVELS } from './stores/meta';
metaActions.setLogLevel(LOG_LEVELS.DEBUG);

import signals from './nuclear/signals';
signals.emitters.fujianStartWS();

// Initialize a Lychee session object.
// (Runs only when the WebSocket connection is ready).
signals.emitters.lyInitializeSession();
signals.emitters.registerOutboundFormat('document', 'ncoda-init', false);


// Render the react-router components -----------------------------------------

// NB: this is the route setup for RevisionsView
//  <Route path="revisions" component={revisions.RevisionsView}>
//     <IndexRoute component={revisions.Revlog}/>
//     <Route path="diff/:revNumber" component={revisions.DiffView}>
//         <Route path="text/:format" component={revisions.TextualDiff}/>
//     </Route>
// </Route>

// NB: this is the route setup for StructureView
// <Route path="structure" component={StructureView}/>


ReactDOM.render((
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" component={NCoda}>
                <IndexRoute component={MainScreen}/>
                <Route path="codescore" component={CodeScoreView}/>
                <Route path="colophon" component={Colophon}/>
            </Route>
        </Router>
    </Provider>
), document.getElementById('julius-goes-here'));
