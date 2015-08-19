// This file starts nCoda
// Copyright 2015 Christopher Antila

import React from "/js/react/react.js";
import {ReactCodeMirror} from "/js/ncoda/CodeMirror.js";

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
				<input type="button" value="Execute" onClick={this.submitToPyPy}></input>
            </div>
        );
    }
});

var Terminal = React.createClass({
	propTypes: {
		outputThis: React.PropTypes.string,
		outputType: React.PropTypes.oneOf(["welcome", "input", "stdout", "stderr"])
	},
	getDefaultProps: function() {
		return {outputThis: "", outputType: "stdout"};
	},
	getInitialState: function() {
		return {stdinEditorValue: "", stdoutEditorValue: ""};
	},
	componentWillReceiveProps: function(nextProps) {
		var outputThis = nextProps.outputThis;
		if (false === outputThis.endsWith("\n")) {
			console.log("rawr with " + outputThis);
			outputThis += "\n";
		}

		if ("input" === nextProps.outputType) {
			this.setState({stdinEditorValue: this.state.stdinEditorValue + outputThis});
		} else {
			this.setState({stdoutEditorValue: this.state.stdoutEditorValue + outputThis});
		}
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
            <div className="ncoda-text-output">
                <h2>Output</h2>
                <ReactCodeMirror path="ncoda-output-stdin"
				                 options={codeMirrorOptions}
								 value={this.state.stdinEditorValue}
	                             />
				<ReactCodeMirror path="ncoda-output-stdout"
				                 options={codeMirrorOptions}
								 value={this.state.stdoutEditorValue}
	                             />
            </div>
        );
    }
});


var NCoda = React.createClass({
    getInitialState: function() {
        return ({sendToConsole: "nCoda is ready for action!",
                 sendToConsoleType: "welcome",
                 });
    },
    componentDidMount: function() {
        pypyjs.stdout = this.stdout;
        pypyjs.stderr = this.stderr;
    },
    submitToPyPy: function(thisText) {
        if ("" === thisText || undefined === thisText) {
            return;
        }
        this.outputToTerminal(thisText, "input");
        pypyjs.exec(thisText).then(this.outputToTerminal);
    },
    stdout: function(thisText) {
        this.outputToTerminal(thisText, "stdout");
    },
    stderr: function(thisText) {
        this.outputToTerminal(thisText, "stderr");
    },
    outputToTerminal: function(thisText, outputType) {
        // Sets state so the Terminal component will output something new.
        // - thisText (str): the new text that should be added to the terminal
        // - outputType (str): the type of output held in "thisText", one of "stdout," "stderr,"
        //   "input," or "output." Any other value is interpreted as "output."
        if ("" === thisText || null === thisText) {
            return;
        }
        if (outputType !== "stdout" && outputType !== "stderr" && outputType !== "input") {
            outputType = "output";
        }
        this.setState({sendToConsole: thisText, sendToConsoleType: outputType});
    },
    render: function() {
        return (
            <div className="ncoda">
                <TextEditor submitToPyPy={this.submitToPyPy} />
                <Terminal outputThis={this.state.sendToConsole}
                          outputType={this.state.sendToConsoleType}
                          />
            </div>
        );
    }
});

//

export {NCoda};
