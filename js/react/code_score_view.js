// -*- coding: utf-8 -*-
//-------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/code_score_view.js
// Purpose:                React components for CodeScoreView.
//
// Copyright (C) 2015 Christopher Antila, Wei Gao
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


import React from "react";
import ReactCodeMirror from "./CodeMirror";

import getters from '../nuclear/getters';
import reactor from '../nuclear/reactor';
import signals from '../nuclear/signals';


function handleSeparator(doThis, thisDirection, zeroElem, oneElem) {
    // This function handles resizing elements separated by a Separator component.
    //
    // @param doThis (int): Move the element by this many pixels. (0, 0) is at the top-left.
    // @param thisDirection (string): Either "horizontal" or "vertical," depending on the
    //        intended direction of movement. Note this is the *opposite* of the Separator
    //        component's "direction" prop.
    // @param zeroElem (Element): The element closer to "zero" in the direction of movement. For
    //        vertical movement, this is the higher Element; for horizontal movement this is the
    //        Element on the left.
    // @param oneElem (Element): The other element that's being resized.

    // get the existing span
    let zeroMagnitude;
    let oneMagnitude;
    if ("vertical" === thisDirection) {
        zeroMagnitude = zeroElem.offsetHeight;
        oneMagnitude = oneElem.offsetHeight;
    } else {
        zeroMagnitude = zeroElem.offsetWidth;
        oneMagnitude = oneElem.offsetWidth;
    }

    // Sometimes when things move too quickly, they can somehow get out of sync, and there will
    // be spaces around the Separator. This ensures that won't happen.
    const requiredTotal = zeroMagnitude + oneMagnitude;

    // do the adjustment
    zeroMagnitude += doThis;
    oneMagnitude -= doThis;

    // double-check it adds up
    if ((zeroMagnitude + oneMagnitude) < requiredTotal) {
        zeroMagnitude += requiredTotal - (zeroMagnitude + oneMagnitude);
    } else if ((zeroMagnitude + oneMagnitude) > requiredTotal) {
        zeroMagnitude -= (zeroMagnitude + oneMagnitude) - requiredTotal;
    }

    // set everything
    let dimension = ('vertical' === thisDirection) ? 'height' : 'width';
    zeroElem.style[dimension] = zeroMagnitude + 'px';
    oneElem.style[dimension] = oneMagnitude + 'px';
};


var TextEditor = React.createClass({
    propTypes: {
        submitToPyPy: React.PropTypes.func.isRequired,
        submitToLychee: React.PropTypes.func.isRequired
    },
    getInitialState: function() {
        return {editorValue: ""};
    },
    updateEditorValue: function(withThis) {
        // TODO: is this too much re-rendering? To be going through TextEditor with "state" on every single key press?
        this.setState({editorValue: withThis});
    },
    submitToPyPy: function(changeEvent) {
        this.props.submitToPyPy(this.state.editorValue);
    },
    submitToLychee: function(changeEvent) {
        this.props.submitToLychee(this.state.editorValue, 'lilypond');
    },
    render: function() {
        var codeMirrorOptions = {
            "mode": "python",
            "theme": "solarized dark",
            "indentUnit": 4,
            "indentWithTabs": false,
            "smartIndent": true,
            "electricChars": true,
            "lineNumbers": true,
            "inputStyle": "contenteditable"  // NOTE: this usually defaults to "textarea" on
                                             // desktop and may not be so good for us, but it has
                                             // better IME and and screen reader support
        };
        return (
            <div className="ncoda-text-editor">
                <h2>Text Editor</h2>
                <ReactCodeMirror path="ncoda-editor"
                                 options={codeMirrorOptions}
                                 value={this.state.editorValue}
                                 onChange={this.updateEditorValue}
                                 />
                <div className="ncoda-text-editor-controls">
                    <button className="btn" value="Run as Python" onClick={this.submitToPyPy}>Run as Python</button>
                    <button className="btn" value="Display as LilyPond" onClick={this.submitToLychee}>Submit as LilyPond</button>
                </div>
            </div>
        );
    }
});


var Verovio = React.createClass({
    //
    // State
    // =====
    // - meiForVerovio
    // - renderedMei
    // - verovio
    //

    mixins: [reactor.ReactMixin],
    getDataBindings: function() {
        return {meiForVerovio: getters.meiForVerovio};
    },
    getInitialState: function() {
        // - verovio: the instance of Verovio Toolkit
        // - renderedMei: the current SVG score as a string
        // - meiForVerovio: do NOT set in this function (set by the ReactMixin)
        return {verovio: null, renderedMei: ''};
    },
    renderWithVerovio: function(renderThis) {
        // Ensure there's an instance of Verovio available, and use it to render "renderThis."
        //
        // TODO: move all the interaction with Verovio to part of the model
        //

        if (null === this.state.verovio) {
            return '<div class="verovio-waiting"><i class="fa fa-spinner fa-5x fa-spin"></i><div>Loading ScoreView</div></div>';
        } else if (null === renderThis) {
            return 'Received no MEI to render.';
        } else {
            let theOptions = {inputFormat: 'mei'};
            theOptions = JSON.stringify(theOptions);
            let rendered = this.state.verovio.renderData(renderThis, theOptions)
            // TODO: dynamically set the height of the .ncoda-verovio <div> so it automatically responds proportionally to width changes
            rendered = rendered.replace('width="2100px" height="2970px"', '');
            return rendered;
        }
    },
    makeVerovio: function() {
        // TODO: consider whether we should be making a global instance? (I'm thinking one per
        //       Verovio component is good though)

        try {
            this.setState({verovio: new verovio.toolkit()});
        } catch (err) {
            if ('ReferenceError' !== err.name) {
                throw err;
            } else {
                window.setTimeout(this.makeVerovio, 250);
            }
        }
    },
    componentDidMount: function() {
        this.makeVerovio();
    },
    componentWillUnmount: function() {
        delete this.state.verovio;
    },
    render: function() {
        let innerHtml = {'__html': this.renderWithVerovio(this.state.meiForVerovio)};
        return (
            <div className="ncoda-verovio" ref="verovioFrame" dangerouslySetInnerHTML={innerHtml}></div>
        );
    }
});


var WorkTable = React.createClass({
    propTypes: {
        meiForVerovio: React.PropTypes.string,
        submitToPyPy: React.PropTypes.func.isRequired,
        submitToLychee: React.PropTypes.func.isRequired
    },
    getDefaultProps: function() {
        return ( {meiForVerovio: ""} );
    },
    handleSeparator: function(doThis, thisDirection) {
        var wt = React.findDOMNode(this.refs.workTable);
        handleSeparator(doThis, thisDirection, React.findDOMNode(this.refs.textEditor),
                        React.findDOMNode(this.refs.verovio));
    },
    render: function () {
        return (
            <div ref="workTable" className="ncoda-work-table">
                <TextEditor ref="textEditor"
                            submitToPyPy={this.props.submitToPyPy}
                            submitToLychee={this.props.submitToLychee} />
                <Separator direction="vertical" movingFunction={this.handleSeparator} />
                <Verovio ref="verovio" meiForVerovio={this.props.meiForVerovio} />
            </div>
        );
    }
});


var TerminalWindow = React.createClass({
    propTypes: {
        outputThis: React.PropTypes.string,
        extraClass: React.PropTypes.string
    },
    getDefaultProps: function() {
        return {outputThis: '', extraClass: ''};
    },
    formatStringForOutput: function(outputThis) {
        // Formats a string properly so it can be outputted in the window as dangerouslySetInnerHTML.
        //

        // TODO: how to make this replace all occurrences?
        // TODO: how to avoid other possible attacks?
        while (outputThis.includes('<')) {
            outputThis = outputThis.replace('<', '&lt;');
        }
        while (outputThis.includes('>')) {
            outputThis = outputThis.replace('>', '&gt;');
        }

        // convert newlines to <br/>
        while (outputThis.includes('\n')) {
            outputThis = outputThis.replace('\n', '<br/>');
        }

        // finally append our thing
        if (!outputThis.endsWith('<br/>')) {
            outputThis += '<br/>';
        }
        // wrap the output in <pre> tag to preserve spaces and tabs.
        outputThis = `<pre>${outputThis}</pre>`;
        return outputThis;
    },
    render: function() {
        var innerHtml = {__html: this.formatStringForOutput(this.props.outputThis)};
        var className = "ncoda-terminal-window";
        if (this.props.extraClass.length > 0) {
            className += " " + this.props.extraClass;
        }
        return (
            <div className={className} dangerouslySetInnerHTML={innerHtml}/>
        );
    }
});


var TerminalOutput = React.createClass({
    // NOTE: if the output isn't changing, you can use ``null`` for props.outputType
    mixins: [reactor.ReactMixin],
    getDataBindings: function() {
        return {stdout: getters.stdout, stderr: getters.stderr, stdin: getters.stdin};
    },
    handleSeparator: function(doThis, thisDirection) {
        handleSeparator(doThis, thisDirection, React.findDOMNode(this.refs.theLeftBox),
                        React.findDOMNode(this.refs.theRightBox));
    },
    render: function() {
        return (
            <div id="ncoda-terminal-output" className="ncoda-terminal-output">
                <h3><div>Your Input</div><div>Python Output</div></h3>
                <div className="ncoda-output-terminals">
                    <TerminalWindow outputThis={this.state.stdin} ref="theLeftBox" />
                    <Separator direction="vertical" movingFunction={this.handleSeparator} />
                    <TerminalWindow outputThis={this.state.stdout} ref="theRightBox" />
                </div>
            </div>
        );
    }
});


var Separator = React.createClass({
    // TODO: let the caller submit two @id attributes, on which we'll set min- and max- properties,
    //       different depending on whether it's horizontal or vertical. And without those props,
    //       the resize cursor won't be shown.
    propTypes: {
        extraCssClass: React.PropTypes.string,  // to add a CSS class to this Separator
        direction: React.PropTypes.oneOf(["horizontal", "vertical"]),
        movingFunction: React.PropTypes.func  // TODO: write explanation about this
    },
    getDefaultProps: function() {
        return {direction: "horizontal", extraCssClass: null};
    },
    getInitialState: function() {
        // - "mouseDown": set to "true" when the mouse is down
        return {mouseDown: false, recentestObservation: null};
    },
    onMouseMove: function(event) {
        if (this.state.mouseDown && this.props.movingFunction) {
            let state = {};
            let direction = null;  // this will be opposite of the Separator's direction
            if ('vertical' === this.props.direction) {
                state['recentestObservation'] = event.clientX;
                direction = 'horizontal';
            } else {
                state['recentestObservation'] = event.clientY;
                direction = 'vertical';
            }
            let magnitude = state.recentestObservation - this.state.recentestObservation;
            this.setState(state);
            this.props.movingFunction(magnitude, direction );
        }
    },
    onMouseDown: function(event) {
        // make sure we start in the right place
        let state = {mouseDown: true};
        if ('vertical' === this.props.direction) {
            state['recentestObservation'] = event.clientX;
        } else {
            state['recentestObservation'] = event.clientY;
        }

        // subscribe to MouseEvent events so we can process the dragging
        this.refs.thePlane.addEventListener('mousemove', this.onMouseMove);
        this.refs.thePlane.addEventListener('mouseup', this.onMouseUp);

        // set the "mouse down" CSS classes and recentestObservation
        this.setState(state);
    },
    onMouseUp: function(event) {
        // unsubscribe to MouseEvent events
        this.refs.thePlane.removeEventListener(MouseEvent, this.mouseEventMultiplexer);

        // make sure we stop in the right place
        this.onMouseMove(event);

        // set the "mouse up" CSS classes
        this.setState({mouseDown: false});
    },
    render: function() {
        let className = `nc-separator nc-separator-${this.props.direction}`;
        let planeStyle = {display: 'none'};
        if (null !== this.props.extraCssClass) {
            className = `${className} ${this.props.extraCssClass}`;
        }
        if (this.state.mouseDown) {
            className = `${className} nc-separator-selected`;
            planeStyle.display = 'block';
        }
        return (
            <div className={className} onMouseDown={this.onMouseDown}>
                <div ref="thePlane" className="nc-separator-plane" style={planeStyle}/>
            </div>
        );
    }
});


var CodeScoreView = React.createClass({
    propTypes: {
        meiForVerovio: React.PropTypes.string,
    },
    getDefaultProps: function() {
        return ( {meiForVerovio: "", sendToConsole: "", sendToConsoleType: null} );
    },
    getInitialState: function() {
        return ({sendToConsole: "nCoda is ready for action!",
                 sendToConsoleType: "welcome",
                 });
    },
    handleSeparator: function(doThis, thisDirection) {
        handleSeparator(doThis, thisDirection, React.findDOMNode(this.refs.workTable),
                        React.findDOMNode(this.refs.terminalOutput));
    },
    render: function() {
        return (
            <div id="nc-csv-frame">
                <WorkTable ref="workTable"
                           submitToPyPy={signals.emitters.submitToPyPy}
                           submitToLychee={signals.emitters.submitToLychee}
                           meiForVerovio={this.props.meiForVerovio}
                />
                <Separator movingFunction={this.handleSeparator}/>
                <TerminalOutput ref="terminalOutput"/>
            </div>
        );
    }
});

//

// export {CodeScoreView, TextEditor, Verovio, WorkTable, TerminalOutput, Separator};
export default CodeScoreView;
