// -*- coding: utf-8 -*-
//-------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/ncoda-init.js
// Purpose:                Initializes Julius for nCoda.
//
// Copyright (C) 2016 Christopher Antila
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

// register the NuclearJS Stores (as early as possible)
import {init} from './nuclear/init';

// third-party libraries
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, IndexRoute, Route} from 'react-router';  // TODO: move to submodule

// log!
import log from './util/log';

// Julius React components
// TODO: these won't be needed when the react-router stuff is in a submodule
import NCoda from './react/ncoda';
import {MainScreen, Colophon} from './react/ncoda';
import StructureView from './react/structure_view';
import CodeScoreView from './react/code_score_view';
import RevisionView from './react/revision_view';

// Set the default log level and connect to Fujian.
import signals from './nuclear/signals';
signals.emitters.setLogLevel(log.LEVELS.DEBUG);
signals.emitters.fujianStartWS();


// Render the react-router components -----------------------------------------
// TODO: move this to a submodule
ReactDOM.render((
    <Router>
        <Route path="/" component={NCoda}>
            <IndexRoute component={MainScreen}/>
            <Route path="codescore" component={CodeScoreView}/>
            <Route path="structure" component={StructureView}/>
            <Route path="revision" component={RevisionView}/>
            <Route path="colophon" component={Colophon}/>
        </Route>
    </Router>
), document.getElementById('julius-goes-here'));
