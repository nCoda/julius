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
    'hgChangesetHistory': mercurial.ChangesetHistory,
    'instruments': documentModule.scoreDef.Instruments,
    'stdin': stdio.Stdin,
    'stdout': stdio.Stdout,
    'stderr': stdio.Stderr,  // NOTE: don't use stderr (for now?) because it isn't shown in CodeScoreView
    'meiForVerovio': verovio.MeiForVerovio,
    'sectionContextMenu': structure_view.SectionContextMenu,
    'logLevel': juliusStores.LogLevel,
    'DialogueBox': generics.DialogueBox,
});

// TODO: this is temporary... it's just setting up the default data
const initialDataAsString = `{"logLevel":1,"hgChangesetHistory":[{"summary":"swapped outer voices","parents":[],"name":"Christopher Antila","date":"2015-10-06","changeset":"","username":"","files":[],"tag":"","diffRemoved":0,"diffAdded":0,"email":"","children":[]},{"summary":"corrected whatever blah","parents":[],"name":"Christopher Antila","date":"2015-09-14","changeset":"","username":"","files":[],"tag":"","diffRemoved":0,"diffAdded":0,"email":"","children":[]},{"summary":"who let the dogs out?","parents":[],"name":"Christopher Antila","date":"2014-12-22","changeset":"","username":"","files":[],"tag":"","diffRemoved":0,"diffAdded":0,"email":"","children":[]},{"summary":"added some notes","parents":[],"name":"Honoré de Balzac","date":"2015-10-09","changeset":"","username":"","files":[],"tag":"","diffRemoved":0,"diffAdded":0,"email":"","children":[]},{"summary":"put in some stuff","parents":[],"name":"Honoré de Balzac","date":"2015-10-08","changeset":"","username":"","files":[],"tag":"","diffRemoved":0,"diffAdded":0,"email":"","children":[]},{"summary":"clean up WenXuan's noodles","parents":[],"name":"Honoré de Balzac","date":"2015-05-05","changeset":"","username":"","files":[],"tag":"","diffRemoved":0,"diffAdded":0,"email":"","children":[]},{"summary":"小心點","parents":[],"name":"卓文萱","date":"2015-05-07","changeset":"","username":"","files":[],"tag":"","diffRemoved":0,"diffAdded":0,"email":"","children":[]},{"summary":"我买了面条","parents":[],"name":"卓文萱","date":"2015-05-04","changeset":"","username":"","files":[],"tag":"","diffRemoved":0,"diffAdded":0,"email":"","children":[]},{"summary":"狗唱歌","parents":[],"name":"卓文萱","date":"2014-12-20","changeset":"","username":"","files":[],"tag":"","diffRemoved":0,"diffAdded":0,"email":"","children":[]}],"stderr":[],"stdin":[],"sectionContextMenu":{"display":"none","top":"0px","left":"0px"},"stdout":[],"instruments":[[{"label":"Flauto piccolo"},{"label":"Flauto I"},{"label":"Flauto II"}],[{"label":"Oboe I"},{"label":"Oboe II"},{"label":"Corno ingelese"}],[{"label":"Clarinetto in B I"},{"label":"Clarinetto in B II"},{"label":"Clarinetto basso in B"}],[{"label":"Fagotto I"},{"label":"Fagotto II"},{"label":"Contrafagotto"}],[{"label":"Corno in F I"},{"label":"Corno in F II"},{"label":"Corno in F III"},{"label":"Corno in F IV"}],[{"label":"Tromba in B I"},{"label":"Tromba in B II"},{"label":"Tromba in B III"}],[{"label":"Trombone I"},{"label":"Trombone II"},{"label":"Trombone III"}],[{"label":"Timpani I"},{"label":"Timpani II"}],{"label":"Stahlstäbe"},{"label":"Triangolo"},{"label":"2 Arpe"},[{"label":"Violino I"},{"label":"Violino II"}],{"label":"Viola"},{"label":"Violoncello"},{"label":"Contrabasso"}],"meiForVerovio":"","headerMetadata":[{"name":"Author","value":"Kitty Cat"},{"name":"Title","value":"Meowmeow"},{"name":"Date","value":"42nd of Telephone"}]}`;
const initialData = JSON.parse(initialDataAsString);
reactor.loadState(initialData);
// NOTE: I kept these following signals because they'll help when I have to create a fake MEI document for testing
// signals.emitters.addHeader('Author', 'Kitty Cat');
// signals.emitters.addHeader('Title', 'Meowmeow');
// signals.emitters.addHeader('Date', '42nd of Telephone');
// signals.emitters.hgAddChangeset({name: 'Christopher Antila', date: '2015-10-06', summary: 'swapped outer voices'});
// signals.emitters.hgAddChangeset({name: 'Christopher Antila', date: '2015-09-14', summary: 'corrected whatever blah'});
// signals.emitters.hgAddChangeset({name: 'Christopher Antila', date: '2014-12-22', summary: 'who let the dogs out?'});
// signals.emitters.hgAddChangeset({name: 'Honoré de Balzac', date: '2015-10-09', summary: 'added some notes'});
// signals.emitters.hgAddChangeset({name: 'Honoré de Balzac', date: '2015-10-08', summary: 'put in some stuff'});
// signals.emitters.hgAddChangeset({name: 'Honoré de Balzac', date: '2015-05-05', summary: 'clean up WenXuan\'s noodles'});
// signals.emitters.hgAddChangeset({name: '卓文萱', date: '2015-05-07', summary: '小心點'});
// signals.emitters.hgAddChangeset({name: '卓文萱', date: '2015-05-04', summary: '我买了面条'});
// signals.emitters.hgAddChangeset({name: '卓文萱', date: '2014-12-20', summary: '狗唱歌'});
// signals.emitters.addInstrumentGroup([{label: 'Flauto piccolo'},
//     {label: 'Flauto I'},
//     {label: 'Flauto II'}]);
// signals.emitters.addInstrumentGroup([{label: 'Oboe I'},
//     {label: 'Oboe II'},
//     {label: 'Corno ingelese'}]);
// signals.emitters.addInstrumentGroup([{label: 'Clarinetto in B I'},
//     {label: 'Clarinetto in B II'},
//     {label: 'Clarinetto basso in B'}]);
// signals.emitters.addInstrumentGroup([{label: 'Fagotto I'},
//     {label: 'Fagotto II'},
//     {label: 'Contrafagotto'}]);
// signals.emitters.addInstrumentGroup([{label: 'Corno in F I'},
//     {label: 'Corno in F II'},
//     {label: 'Corno in F III'},
//     {label: 'Corno in F IV'}]);
// signals.emitters.addInstrumentGroup([{label: 'Tromba in B I'},
//     {label: 'Tromba in B II'},
//     {label: 'Tromba in B III'}]);
// signals.emitters.addInstrumentGroup([{label: 'Trombone I'},
//     {label: 'Trombone II'},
//     {label: 'Trombone III'}]);
// signals.emitters.addInstrumentGroup([{label: 'Timpani I'},
//     {label: 'Timpani II'}]);
// signals.emitters.addInstrument({label: 'Stahlstäbe'});
// signals.emitters.addInstrument({label: 'Triangolo'});
// signals.emitters.addInstrument({label: '2 Arpe'});
// signals.emitters.addInstrumentGroup([{label: 'Violino I'},
//     {label: 'Violino II'}]);
// signals.emitters.addInstrument({label: 'Viola'});
// signals.emitters.addInstrument({label: 'Violoncello'});
// signals.emitters.addInstrument({label: 'Contrabasso'});

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
