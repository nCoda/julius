// This file starts nCoda
// Copyright 2015 Christopher Antila

import React from "react";
import ReactCodeMirror from "./CodeMirror.src.js";

var handleSeparator = function(doThis, thisDirection, zeroElem, oneElem) {
    // This function handles resizing elements separated by a Separator component.
    //
    // @param doThis (int): Move the element by this many pixels. (0, 0) is at the top-left.
    // @param thisDirection (string): Either "horizontal" or "vertical," depending on the
    //        intended direction of movement. Note this is the *opposite* of the Separator
    //        component's "direction" prop.
    // @param zeroElem (Element): The element closer to "zero" in the direction of movement. For
    //        vertical movement, this is the higher Element; for horizontal movement this is the
    //        Element on the left.
    // @param oneEleme (Element): The other element that's being resized.

    // get the existing span
    var zeroStyleAttr;
    var oneStyleAttr;
    if ("vertical" === thisDirection) {
        zeroStyleAttr = zeroElem.offsetHeight;
        oneStyleAttr = oneElem.offsetHeight;
    } else {
        zeroStyleAttr = zeroElem.offsetWidth;
        oneStyleAttr = oneElem.offsetWidth;
    }

    // Sometimes when things move too quickly, they can somehow get out of sync, and there will
    // be spaces around the Separator. This ensures that won't happen.
    var requiredTotal = zeroStyleAttr + oneStyleAttr;

    // do the adjustment
    zeroStyleAttr += doThis;
    oneStyleAttr -= doThis;

    // double-check it adds up
    if ((zeroStyleAttr + oneStyleAttr) < requiredTotal) {
        var magnitude = requiredTotal - (zeroStyleAttr + oneStyleAttr);
        zeroStyleAttr += magnitude;
    } else if ((zeroStyleAttr + oneStyleAttr) > requiredTotal) {
        var magnitude = (zeroStyleAttr + oneStyleAttr) - requiredTotal;
        zeroStyleAttr -= magnitude;
    }

    // make the CSS thing
    if ("vertical" === thisDirection) {
        var zeroStyleAttr = "height: " + zeroStyleAttr + "px;";
        var oneStyleAttr = "height: " + oneStyleAttr + "px;";
    } else {
        var zeroStyleAttr = "width: " + zeroStyleAttr + "px;";
        var oneStyleAttr = "width: " + oneStyleAttr + "px;";
    }

    // set everything
    zeroElem.setAttribute("style", zeroStyleAttr);
    oneElem.setAttribute("style", oneStyleAttr);
};


var TextEditor = React.createClass({
    propTypes: {
        submitToPyPy: React.PropTypes.func.isRequired
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
                <h2>Input</h2>
                <ReactCodeMirror path="ncoda-editor"
                                 options={codeMirrorOptions}
                                 value={this.state.editorValue}
                                 onChange={this.updateEditorValue}
                                 />
                <div className="ncoda-pypyjs-controls">
                    <input type="button" value="Execute" onClick={this.submitToPyPy}></input>
                </div>
            </div>
        );
    }
});


var Verovio = React.createClass({
    propTypes: {
        meiToRender: React.PropTypes.string
    },
    getDefaultProps: function() {
        return ( {meiToRender: ""} );
    },
    getInitialState: function() {
        return {verovio: null};
    },
    componentDidMount: function() {
        var newVerovio = new verovio.toolkit();
        this.setState({verovio: newVerovio});
    },
    componentWillUnmount: function() {
        delete this.state.verovio;
    },
    render: function() {
        var innerHtml = "";
        if (null !== this.state.verovio) {
            var theOptions = {
                inputFormat: "mei"
            };
            var innerHtml = this.state.verovio.renderData(this.props.meiForVerovio,
                                                          JSON.stringify(theOptions));
        }
        innerHtml = {"__html": innerHtml};
        return (
            <div className="ncoda-verovio" ref="verovioFrame" dangerouslySetInnerHTML={innerHtml}></div>
        );
    }
});


var WorkTable = React.createClass({
    propTypes: {
        meiForVerovio: React.PropTypes.string,
        submitToPyPy: React.PropTypes.func.isRequired
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
                <TextEditor ref="textEditor" submitToPyPy={this.props.submitToPyPy} />
                <Separator direction="vertical" movingFunction={this.handleSeparator} />
                <Verovio ref="verovio" meiForVerovio={this.props.meiForVerovio} />
            </div>
        );
    }
});


var TerminalOutput = React.createClass({
    // NOTE: if the output isn't changing, you can use ``null`` for props.outputType
    propTypes: {
        outputThis: React.PropTypes.string,
        outputType: React.PropTypes.oneOf([null, "welcome", "input", "stdout", "stderr"])
    },
    getDefaultProps: function() {
        return {outputThis: "", outputType: "stdout"};
    },
    getInitialState: function() {
        return {stdinEditorValue: "", stdoutEditorValue: ""};
    },
    componentWillReceiveProps: function(nextProps) {
        if (null !== nextProps.outputType) {
            var outputThis = nextProps.outputThis;
            if (false === outputThis.endsWith("\n")) {
                outputThis += "\n";
            }

            if ("input" === nextProps.outputType) {
                this.setState({stdinEditorValue: this.state.stdinEditorValue + outputThis});
            } else {
                this.setState({stdoutEditorValue: this.state.stdoutEditorValue + outputThis});
            }
        }
    },
    reRender: function() {
        // By calling forceUpdate() without changing props or state, we're disallowing any of the
        // user's input from reaching the CodeMirror widget.
        this.forceUpdate();
    },
    handleSeparator: function(doThis, thisDirection) {
        handleSeparator(doThis, thisDirection, React.findDOMNode(this.refs.theLeftBox),
                        React.findDOMNode(this.refs.theRightBox));
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
            <div id="ncoda-terminal-output" className="ncoda-terminal-output">
                <h2>Output</h2>
                <div className="ncoda-output-terminals">
                    <div className="ncoda-output-stdin">
                        <ReactCodeMirror path="ncoda-output-stdin"
                                         ref="theLeftBox"
                                         options={codeMirrorOptions}
                                         value={this.state.stdinEditorValue}
                                         onChange={this.reRender}  // make component read-only
                        />
                    </div>
                    <Separator direction="vertical" movingFunction={this.handleSeparator} />
                    <div className="ncoda-output-stdout">
                        <ReactCodeMirror path="ncoda-output-stdout"
                                         ref="theRightBox"
                                         options={codeMirrorOptions}
                                         value={this.state.stdoutEditorValue}
                                         onChange={this.reRender}  // make component read-only
                        />
                    </div>
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
        direction: React.PropTypes.oneOf(["horizontal", "vertical"]),
        movingFunction: React.PropTypes.func  // TODO: write explanation about this
    },
    getDefaultProps: function() {
        return {direction: "horizontal"};
    },
    getInitialState: function() {
        // - "mouseDown": set to "true" when the mouse is down
        return {mouseDown: false, recentestObservation: null};
    },
    onMouseMove: function(event) {
        if (this.state.mouseDown && this.props.movingFunction) {
            var state = {};
            var direction = null;  // this will be opposite of the Separator's direction
            if ("vertical" === this.props.direction) {
                state["recentestObservation"] = event.clientX;
                direction = "horizontal";
            } else {
                state["recentestObservation"] = event.clientY;
                direction = "vertical";
            }
            var magnitude = state.recentestObservation - this.state.recentestObservation;
            this.setState(state);
            this.props.movingFunction(magnitude, direction );
        }
    },
    onMouseDown: function(event) {
        var state = {mouseDown: true};
        if ("vertical" === this.props.direction) {
            state["recentestObservation"] = event.clientX;
        } else {
            state["recentestObservation"] = event.clientY;
        }
        this.setState(state);
    },
    onMouseUp: function(event) {
        this.onMouseMove(event);
        this.setState({mouseDown: false});
    },
    render: function() {
        var className = "ncoda-separator ncoda-separator-" + this.props.direction;
        if (this.state.mouseDown) {
            className += " ncoda-separator-selected";
        }
        return ( <div className={className}
                      onMouseDown={this.onMouseDown}
                      onMouseUp={this.onMouseUp}
                      onMouseMove={this.onMouseMove}></div> );
    }
});


var NCoda = React.createClass({
    propTypes: {
        meiForVerovio: React.PropTypes.string,
        sendToConsole: React.PropTypes.string,
        // TODO: find a better way to keep this "sendToConsoleType" in sync with that on TerminalOutput
        sendToConsoleType: React.PropTypes.oneOf([null, "welcome", "input", "stdout", "stderr"]),
        submitToPyPy: React.PropTypes.func
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
            <div className="ncoda">
                <WorkTable ref="workTable"
                           submitToPyPy={this.props.submitToPyPy}
                           meiForVerovio={this.props.meiForVerovio}
                           />
                <Separator movingFunction={this.handleSeparator} />
                <TerminalOutput ref="terminalOutput"
                                outputThis={this.props.sendToConsole}
                                outputType={this.props.sendToConsoleType}
                />
            </div>
        );
    }
});

//

export {NCoda, TextEditor, Verovio, WorkTable, TerminalOutput, Separator};
