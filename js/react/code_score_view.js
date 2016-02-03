// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
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
// ------------------------------------------------------------------------------------------------

import {Button, ButtonGroup} from 'amazeui-react';
import React from "react";
import ReactDOM from 'react-dom';
import ReactCodeMirror from "./CodeMirror";

import getters from '../nuclear/getters';
import reactor from '../nuclear/reactor';
import signals from '../nuclear/signals';


/** This function handles resizing elements separated by a Separator component.
 *
 * @param {int} doThis - Move the element by this many pixels. (0, 0) is at the top-left.
 * @param {str} thisDirection - Either "horizontal" or "vertical," depending on the intended
 *     direction of movement. Note this is the *opposite* of the Separator component's "direction" prop.
 * @param {Element} zeroElem - The element closer to "zero" in the direction of movement. For vertical
 *     movement, this is the higher Element; for horizontal movement this is the Element on the left.
 * @param {Element} oneElem - The other element being resized.
 * @returns {undefined}
 */
function handleSeparator(doThis, thisDirection, zeroElem, oneElem) {
    // get the existing span
    let zeroMagnitude;
    let oneMagnitude;
    if ('vertical' === thisDirection) {
        zeroMagnitude = zeroElem.offsetHeight;
        oneMagnitude = oneElem.offsetHeight;
    }
    else {
        zeroMagnitude = zeroElem.offsetWidth;
        oneMagnitude = oneElem.offsetWidth;
    }

    // do the adjustment
    zeroMagnitude += doThis;
    oneMagnitude -= doThis;

    // set everything
    const dimension = ('vertical' === thisDirection) ? 'height' : 'width';
    zeroElem.style[dimension] = `${zeroMagnitude}px`;
    oneElem.style[dimension] = `${oneMagnitude}px`;
}


const TextEditor = React.createClass({
    propTypes: {
        submitToLychee: React.PropTypes.func.isRequired,
        submitToPyPy: React.PropTypes.func.isRequired,
    },
    getInitialState() {
        return {editorValue: ''};
    },
    handleEditorChange(withThis) {
        // TODO: is this too much re-rendering? To be going through TextEditor with "state" on every single key press?
        this.setState({editorValue: withThis});
    },
    handleSubmitPython() {
        this.props.submitToPyPy(this.state.editorValue);
    },
    handleSubmitLilyPond() {
        this.props.submitToLychee(this.state.editorValue, 'lilypond');
    },
    render() {
        const codeMirrorOptions = {
            mode: "python",
            theme: "solarized dark",
            indentUnit: 4,
            indentWithTabs: false,
            smartIndent: true,
            electricChars: true,
            lineNumbers: true,
            inputStyle: "contenteditable",  // NOTE: this usually defaults to "textarea" on
                                            // desktop and may not be so good for us, but it has
                                            // better IME and and screen reader support
        };
        return (
            <div className="ncoda-text-editor">
                <h2>{`Text Editor`}</h2>
                <ReactCodeMirror
                    path="ncoda-editor"
                    options={codeMirrorOptions}
                    value={this.state.editorValue}
                    onChange={this.handleEditorChange}
                />
                <div className="ncoda-text-editor-controls">
                    <ButtonGroup>
                        <Button onClick={this.handleSubmitPython}>
                            {`Run as Python`}
                        </Button>
                        <Button onClick={this.handleSubmitLilyPond}>
                            {`Submit as Lilypond`}
                        </Button>
                    </ButtonGroup>
                </div>
            </div>
        );
    },
});


const Verovio = React.createClass({
    //
    // State
    // =====
    // - meiForVerovio
    // - renderedMei
    // - verovio
    //

    mixins: [reactor.ReactMixin],
    getDataBindings() {
        return {meiForVerovio: getters.meiForVerovio};
    },
    getInitialState() {
        // - verovio: the instance of Verovio Toolkit
        // - renderedMei: the current SVG score as a string
        // - meiForVerovio: do NOT set in this function (set by the ReactMixin)
        return {verovio: null, renderedMei: ''};
    },
    renderWithVerovio(renderThis) {
        // Ensure there's an instance of Verovio available, and use it to render "renderThis."
        //
        // TODO: move all the interaction with Verovio to part of the model
        //

        if (null === this.state.verovio) {
            return '<div class="verovio-waiting"><i class="fa fa-spinner fa-5x fa-spin"></i><div>Loading ScoreView</div></div>';
        }
        else if (null === renderThis) {
            return 'Received no MEI to render.';
        }

        let theOptions = {inputFormat: 'mei'};
        theOptions = JSON.stringify(theOptions);
        let rendered = this.state.verovio.renderData(renderThis, theOptions);
        // TODO: dynamically set the height of the .ncoda-verovio <div> so it automatically responds proportionally to width changes
        rendered = rendered.replace('width="2100px" height="2970px"', '');
        return rendered;
    },
    makeVerovio() {
        // TODO: consider whether we should be making a global instance? (I'm thinking one per
        //       Verovio component is good though)

        try {
            this.setState({verovio: new verovio.toolkit()});
        }
        catch (err) {
            if ('ReferenceError' === err.name) {
                window.setTimeout(this.makeVerovio, 250);
            }
            else {
                throw err;
            }
        }
    },
    componentWillMount() {
        this.makeVerovio();
        signals.emitters.registerOutboundFormat('verovio', 'Verovio component', true);
    },
    componentWillUnmount() {
        signals.emitters.unregisterOutboundFormat('verovio', 'Verovio component');
        delete this.state.verovio;
    },
    render() {
        const innerHtml = {__html: this.renderWithVerovio(this.state.meiForVerovio)};
        return <div className="ncoda-verovio" ref="verovioFrame" dangerouslySetInnerHTML={innerHtml}/>;
    },
});


const WorkTable = React.createClass({
    propTypes: {
        meiForVerovio: React.PropTypes.string,
        submitToLychee: React.PropTypes.func.isRequired,
        submitToPyPy: React.PropTypes.func.isRequired,
    },
    getDefaultProps() {
        return {meiForVerovio: ''};
    },
    handleSeparator(doThis, thisDirection) {
        handleSeparator(
            doThis,
            thisDirection,
            ReactDOM.findDOMNode(this.refs.textEditor),
            ReactDOM.findDOMNode(this.refs.verovio)
        );
    },
    render() {
        return (
            <div ref="workTable" className="ncoda-work-table">
                <TextEditor
                    ref="textEditor"
                    submitToPyPy={this.props.submitToPyPy}
                    submitToLychee={this.props.submitToLychee}
                />
                <Separator direction="vertical" onMove={this.handleSeparator} />
                <Verovio ref="verovio" meiForVerovio={this.props.meiForVerovio} />
            </div>
        );
    },
});


const TerminalWindow = React.createClass({
    propTypes: {
        extraClass: React.PropTypes.string,
        outputThis: React.PropTypes.string,
    },
    getDefaultProps() {
        return {outputThis: '', extraClass: ''};
    },
    formatString(outputThis) {
        // Formats a string properly so it can be outputted in the window as dangerouslySetInnerHTML.
        //
        let post = outputThis;

        // TODO: how to make this replace all occurrences?
        // TODO: how to avoid other possible attacks?
        while (post.includes('<')) {
            post = post.replace('<', '&lt;');
        }
        while (post.includes('>')) {
            post = post.replace('>', '&gt;');
        }

        // convert newlines to <br/>
        while (post.includes('\n')) {
            post = post.replace('\n', '<br/>');
        }

        // finally append our thing
        if (!post.endsWith('<br/>')) {
            post += '<br/>';
        }
        // wrap the output in <pre> tag to preserve spaces and tabs.
        post = `<pre>${post}</pre>`;
        return post;
    },
    render() {
        const innerHtml = {__html: this.formatString(this.props.outputThis)};
        let className = 'ncoda-terminal-window';
        if (this.props.extraClass.length > 0) {
            className += `${className} ${this.props.extraClass}`;
        }
        return (
            <div className={className} dangerouslySetInnerHTML={innerHtml}/>
        );
    },
});


const TerminalOutput = React.createClass({
    // NOTE: if the output isn't changing, you can use ``null`` for props.outputType
    mixins: [reactor.ReactMixin],
    getDataBindings() {
        return {stdout: getters.stdout, stderr: getters.stderr, stdin: getters.stdin};
    },
    handleSeparator(doThis, thisDirection) {
        handleSeparator(
            doThis,
            thisDirection,
            ReactDOM.findDOMNode(this.refs.theLeftBox),
            ReactDOM.findDOMNode(this.refs.theRightBox)
        );
    },
    render() {
        return (
            <div id="ncoda-terminal-output" className="ncoda-terminal-output">
                <h3><div>{`Your Input`}</div><div>{`Python Output`}</div></h3>
                <div className="ncoda-output-terminals">
                    <TerminalWindow outputThis={this.state.stdin} ref="theLeftBox" />
                    <Separator direction="vertical" onMove={this.handleSeparator} />
                    <TerminalWindow outputThis={this.state.stdout} ref="theRightBox" />
                </div>
            </div>
        );
    },
});


const Separator = React.createClass({
    // TODO: let the caller submit two @id attributes, on which we'll set min- and max- properties,
    //       different depending on whether it's horizontal or vertical. And without those props,
    //       the resize cursor won't be shown.
    propTypes: {
        direction: React.PropTypes.oneOf(["horizontal", "vertical"]),
        extraCssClass: React.PropTypes.string,  // to add a CSS class to this Separator
        onMove: React.PropTypes.func,  // TODO: write explanation about this
    },
    getDefaultProps() {
        return {direction: "horizontal", extraCssClass: null};
    },
    getInitialState() {
        // - "mouseDown": set to "true" when the mouse is down
        return {mouseDown: false, recentestObservation: null};
    },
    handleMouseMove(event) {
        if (this.state.mouseDown && this.props.onMove) {
            const state = {};
            let direction = null;  // this will be opposite of the Separator's direction
            if ('vertical' === this.props.direction) {
                state.recentestObservation = event.clientX;
                direction = 'horizontal';
            }
            else {
                state.recentestObservation = event.clientY;
                direction = 'vertical';
            }
            const magnitude = state.recentestObservation - this.state.recentestObservation;
            this.setState(state);
            this.props.onMove(magnitude, direction );
        }
    },
    handleMouseDown(event) {
        // make sure we start in the right place
        const state = {mouseDown: true};
        if ('vertical' === this.props.direction) {
            state.recentestObservation = event.clientX;
        }
        else {
            state.recentestObservation = event.clientY;
        }

        // subscribe to MouseEvent events so we can process the dragging
        this.refs.thePlane.addEventListener('mousemove', this.handleMouseMove);
        this.refs.thePlane.addEventListener('mouseup', this.handleMouseUp);

        // set the "mouse down" CSS classes and recentestObservation
        this.setState(state);
    },
    handleMouseUp(event) {
        // unsubscribe to MouseEvent events
        this.refs.thePlane.removeEventListener(MouseEvent, this.mouseEventMultiplexer);

        // make sure we stop in the right place
        this.handleMouseMove(event);

        // set the "mouse up" CSS classes
        this.setState({mouseDown: false});
    },
    render() {
        let className = `nc-separator nc-separator-${this.props.direction}`;
        const planeStyle = {display: 'none'};
        if (null !== this.props.extraCssClass) {
            className = `${className} ${this.props.extraCssClass}`;
        }
        if (this.state.mouseDown) {
            className = `${className} nc-separator-selected`;
            planeStyle.display = 'block';
        }
        return (
            <div className={className} onMouseDown={this.handleMouseDown}>
                <div ref="thePlane" className="nc-separator-plane" style={planeStyle}/>
            </div>
        );
    },
});


const CodeScoreView = React.createClass({
    propTypes: {
        meiForVerovio: React.PropTypes.string,
    },
    getDefaultProps() {
        return {meiForVerovio: '', sendToConsole: '', sendToConsoleType: null};
    },
    getInitialState() {
        return {
            sendToConsole: 'nCoda is ready for action!',
            sendToConsoleType: 'welcome',
        };
    },
    handleSeparator(doThis, thisDirection) {
        handleSeparator(
            doThis,
            thisDirection,
            ReactDOM.findDOMNode(this.refs.workTable),
            ReactDOM.findDOMNode(this.refs.terminalOutput)
        );
    },
    render() {
        return (
            <div id="nc-csv-frame">
                <WorkTable
                    ref="workTable"
                    submitToPyPy={signals.emitters.submitToPyPy}
                    submitToLychee={signals.emitters.submitToLychee}
                    meiForVerovio={this.props.meiForVerovio}
                />
                <Separator onMove={this.handleSeparator}/>
                <TerminalOutput ref="terminalOutput"/>
            </div>
        );
    },
});


export default CodeScoreView;
