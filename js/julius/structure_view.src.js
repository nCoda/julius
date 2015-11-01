// React components for Julius, the nCoda user interface
//
// File Name: js/julius/structure_view.src.js
// Purpose: React components for the Julius "StructureView."
//
// Copyright 2015 Christopher Antila

import React from "react";

var StructureView = React.createClass({
    render: function() {
        return (
            <div className="ncoda-structureview-frame">
                <div id="ncoda-menus">
                    <menu id="ncoda-section-menu">
                        <menuitem id="ncoda-section-menu-item-1" label="Open in CodeScoreView">Open in CodeScoreView</menuitem>
                        <menuitem id="ncoda-section-menu-item-2" label="View Version History">View Version History</menuitem>
                        <menuitem id="ncoda-section-menu-item-3" label="Download Source File">Download Source File</menuitem>
                    </menu>
                </div>
                <div id="ncoda-structureview" className="ncoda-structureview">
                    <header>
                        <div className="ncoda-headerbar">
                            <p>Header Bar
                                <button id="headerbar-visibility" name="headerbar-visibility" type="button">Show/Hide</button>
                            </p>
                            <ul id="headerbar-list" className="headers">
                                <li id="header-author">Author</li>
                                <li id="header-title">Title</li>
                                <li id="header-date">Date</li>
                                <li id="header-add">+</li>
                            </ul>
                        </div>

                        <div className="ncoda-expanded-section">
                            <p>
                                <button id="expanded-section-visibility" name="expanded-section-visibility" type="button">Show/Hide</button>
                                Expanded Section View
                            </p>
                            <div id="ncoda-expanded-section-svg">
                                <h2>A</h2>
                                <img src="../../structureview_mock/expanded_section_view.svg"></img>
                            </div>
                        </div>
                    </header>

                    <article className="ncoda-active-sections">
                        <header>
                            Active Score
                        </header>

                        <content>
                            <article className="ncoda-mei-section first-section" id="section-a">
                                <header>
                                    A
                                </header>
                                <div className="ncoda-mei-section-img">
                                    <img src="../../structureview_mock/sectionA.png"/>
                                </div>
                                <footer>
                                    <address>Christopher Antila</address>
                                    <time dateTime="2015-10-06 16:32">Tuesday</time>
                                </footer>
                            </article>

                            <article className="ncoda-mei-section" id="section-b">
                                <header>
                                    B
                                </header>
                                <div className="ncoda-mei-section-img">
                                    <img src="../../structureview_mock/sectionB.png"/>
                                </div>
                                <footer>
                                    <address>Gloria Steinem</address>
                                    <time dateTime="2015-10-09 17:00">Friday</time>
                                </footer>
                            </article>

                            <article className="ncoda-mei-section" id="section-ap">
                                <header>
                                    A&prime;
                                </header>
                                <div className="ncoda-mei-section-img">
                                    <img src="../../structureview_mock/sectionA.png"/>
                                </div>
                                <footer>
                                    <address>Christopher Antila</address>
                                    <time dateTime="2015-10-06 17:00">Tuesday</time>
                                </footer>
                            </article>

                            <article className="ncoda-mei-section" id="section-c">
                                <header>
                                    C
                                </header>
                                <div className="ncoda-mei-section-img">
                                    <img src="../../structureview_mock/sectionC.png"/>
                                </div>
                                <footer>
                                    <address>卓文萱</address>
                                    <time dateTime="2015-05-07 17:00">May 7th</time>
                                </footer>
                            </article>

                            <article className="ncoda-mei-section last-section" id="section-app">
                                <header>
                                    A&prime;&prime;
                                </header>
                                <div className="ncoda-mei-section-img">
                                    <img src="../../structureview_mock/sectionA.png"/>
                                </div>
                                <footer>
                                    <address>Christopher Antila</address>
                                    <time dateTime="2015-10-06 16:32">Tuesday</time>
                                </footer>
                            </article>
                        </content>
                    </article>

                    <footer>
                        <div className="ncoda-scorestructure">
                            <p>Score Structure
                                <button id="scorestructure-visibility" name="scorestructure-visibility" type="button">Show/Hide</button>
                            </p>
                            <ul id="scorestructure-instruments">
                                <li><ul>
                                    <li>Flauto poccolo</li>
                                    <li>Flauto I</li>
                                    <li>Flauto II</li>
                                </ul></li>
                                <li><ul>
                                    <li>Oboe I</li>
                                    <li>Oboe II</li>
                                    <li>Corno inglese</li>
                                </ul></li>
                                <li><ul>
                                    <li>Clarinetto in B I</li>
                                    <li>Clarinetto in B II</li>
                                    <li>Clarinetto basso in B</li>
                                </ul></li>
                                <li><ul>
                                    <li>Fagotto I</li>
                                    <li>Fagotto II</li>
                                    <li>Contrafagotto</li>
                                </ul></li>
                                <li><ul>
                                    <li>Corno in F I</li>
                                    <li>Corno in F II</li>
                                    <li>Corno in F III</li>
                                    <li>Corno in F IV</li>
                                </ul></li>
                                <li><ul>
                                    <li>Tromba in B I</li>
                                    <li>Tromba in B II</li>
                                    <li>Tromba in B III</li>
                                </ul></li>
                                <li><ul>
                                    <li>Trombone I</li>
                                    <li>Trombone II</li>
                                    <li>Trombone III</li>
                                </ul></li>
                                <li><ul>
                                    <li>Timpani I</li>
                                    <li>Timpani II</li>
                                </ul></li>
                                <li>Stahlstäbe</li>
                                <li>Triangolo</li>
                                <li>2 Arpe</li>
                                <li><ul>
                                    <li>Violino I</li>
                                    <li>Violino II</li>
                                </ul></li>
                                <li>Viola</li>
                                <li>Violoncello</li>
                                <li>Contrabasso</li>
                            </ul>
                        </div>

                        <div className="ncoda-collaboration">
                            <p>
                                <button id="collaborators-visibility" name="collaborators-visibility" type="button">Show/Hide</button>
                                Collaborators
                            </p>

                            <div id="ncoda-collaborators-list">
                                <div className="ncoda-collaboration-person">
                                    <address>Christopher Antila</address>
                                    <ul>
                                        <li><time dateTime="2015-10-06 17:00">Tuesday</time>: swapped outer voices</li>
                                        <li><time dateTime="2015-09-14">September 14th</time>: corrected whatever blah</li>
                                        <li><time dateTime="2015-12-22">December 2014</time>: who let the dogs out?</li>
                                    </ul>
                                </div>
                                <div className="ncoda-collaboration-person">
                                    <address>Gloria Steinem</address>
                                    <ul>
                                        <li><time dateTime="2015-10-09">Friday</time>: added some notes</li>
                                        <li><time dateTime="2015-10-08">Thursday</time>: put in some stuff</li>
                                        <li><time dateTime="2015-05-05">May 5th</time>: clean up WenXuan&apos;s noodles</li>
                                    </ul>
                                </div>
                                <div className="ncoda-collaboration-person">
                                    <address>卓文萱</address>
                                    <ul>
                                        <li><time dateTime="2015-05-07">May 7th</time>: 小心點</li>
                                        <li><time dateTime="2015-05-04">May 4th</time>: 我买了面条</li>
                                        <li><time dateTime="2014-12-20">December 2014</time>: 狗唱歌</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        );
    }
});

export default StructureView;
