// -*- coding: utf-8 -*-
//-------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/ncoda-init.js
// Purpose:                Initializes Julius for nCoda.
//
// Copyright (C) 2015 Christopher Antila
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
import {Router, IndexRoute, Route} from 'react-router';  // TODO: move to submodule

// log!
import log from './util/log';

// Julius React components
// TODO: these won't be needed when the react-router stuff is in a submodule
import NCoda from './react/ncoda';
import {MainScreen, Colophon} from './react/ncoda';
import StructureView from './react/structure_view';
import CodeScoreView from './react/code_score_view';

// NuclearJS things
import reactor from './nuclear/reactor';
import headerMetadataStores from './nuclear/stores/headerMetadata';
import mercurial from './nuclear/stores/mercurial';
import documentModule from './nuclear/stores/document';
import stdio from './nuclear/stores/stdio';
import verovio from './nuclear/stores/verovio';
import structure_view from './nuclear/stores/structure_view';
import {stores as juliusStores} from './nuclear/stores/julius';
import {generics} from './nuclear/stores/generics';


import signals from './nuclear/signals';
signals.emitters.setLogLevel(log.LEVELS.DEBUG);
signals.emitters.fujianStartWS();


// Register the NuclearJS Stores ----------------------------------------------
reactor.registerStores({
    'headerMetadata': headerMetadataStores.MetadataHeaders,
    'revlog': mercurial.Revlog,
    'instruments': documentModule.scoreDef.Instruments,
    'stdin': stdio.Stdin,
    'stdout': stdio.Stdout,
    'stderr': stdio.Stderr,  // NOTE: don't use stderr (for now?) because it isn't shown in CodeScoreView
    'meiForVerovio': verovio.MeiForVerovio,
    'sectionContextMenu': structure_view.SectionContextMenu,
    'logLevel': juliusStores.LogLevel,
    'DialogueBox': generics.DialogueBox,
});


// TODO: put this in a more appropriate place (esp. so it registers/unregisters with the StructureView)
signals.emitters.submitToPyPy("import lychee\nlychee.signals.outbound.REGISTER_FORMAT.emit(dtype='vcs', who='ncoda-init')");


// Render the react-router components -----------------------------------------
// TODO: move this to a submodule
ReactDOM.render((
    <Router>
        <Route path="/" component={NCoda}>
            <IndexRoute component={MainScreen}/>
            <Route path="codescore" component={CodeScoreView}/>
            <Route path="structure" component={StructureView}/>
            <Route path="colophon" component={Colophon}/>
        </Route>
    </Router>
), document.getElementById('julius-goes-here'));
