// This file starts nCoda
// Copyright 2015 Christopher Antila

// NOTE: this portion of the code is a copy of the "CodeMirror.js" file in this same directory which,
//       unlike the rest of nCoda, is released with the MIT license.
// TODO: this MIT portion should be removed from the file, and imported at compile time
var ReactCodeMirror = React.createClass({

	propTypes: {
		onChange: React.PropTypes.func,
		onFocusChange: React.PropTypes.func,
		options: React.PropTypes.object,
		path: React.PropTypes.string,
		value: React.PropTypes.string
	},

	getInitialState () {
		return {
			isFocused: false
		};
	},

	componentDidMount () {
		this.codeMirror = CodeMirror.fromTextArea(this.refs.codemirror.getDOMNode(), this.props.options);
		this.codeMirror.on('change', this.codemirrorValueChanged);
		this.codeMirror.on('focus', this.focusChanged.bind(this, true));
		this.codeMirror.on('blur', this.focusChanged.bind(this, false));
		this._currentCodemirrorValue = this.props.value;
	},

	componentWillUnmount () {
		// todo: is there a lighter-weight way to remove the cm instance?
		if (this.codeMirror) {
			this.codeMirror.toTextArea();
		}
	},

	componentWillReceiveProps (nextProps) {
		if (this.codeMirror && this._currentCodemirrorValue !== nextProps.value) {
			this.codeMirror.setValue(nextProps.value);
		}
	},

	getCodeMirror () {
		return this.codeMirror;
	},

	focus () {
		if (this.codeMirror) {
			this.codeMirror.focus();
		}
	},

	focusChanged (focused) {
		this.setState({
			isFocused: focused
		});
		this.props.onFocusChange && this.props.onFocusChange(focused);
	},

	codemirrorValueChanged (doc, change) {
		var newValue = doc.getValue();
		this._currentCodemirrorValue = newValue;
		this.props.onChange && this.props.onChange(newValue);
	},

	render () {
		var className = 'ReactCodeMirror';
		if (this.state.isFocused) {
			className += ' ReactCodeMirror--focused';
		}
		return (
			<div className={className}>
				<textarea ref="codemirror" name={this.props.path} defaultValue={this.props.value} autoComplete="off" />
			</div>
		);
	}

});
// NOTE: end of MIT code

var TextEditor = React.createClass({
    submitToPyPy: function(changeEvent) {
        changeEvent.preventDefault();  // stop the default GET form submission
        this.props.submitToPyPy(changeEvent.target[0].value);
    },
    render: function() {
        return (
            <div className="ncoda-text-editor">
                <h2>Text Editor</h2>
                <form onSubmit={this.submitToPyPy}>
                    <label>
                        When you press "enter," this is sent to PyPy.js:&nbsp;
                        <input type="text"></input>
                    </label>
                </form>
            </div>
        );
    }
});

var TerminalConsole = React.createClass({
    getInitialState: function() {
        return {theConsole: null};
    },
    componentDidMount: function() {
        var theConsole = $("#console").jqconsole();
        theConsole.Write(this.props.outputThis + "\n\n", "jqconsole-welcome");
        this.setState({theConsole: theConsole});
    },
    componentWillReceiveProps: function(nextProps) {
        if (null !== this.state.theConsole) {
            var outputText = nextProps.outputThis;
            var outputClass = "jqconsole-output";
            if ("welcome" === nextProps.outputType) {
                outputClass = "jqconsole-welcome";
                outputText += "\n";
            } else if ("input" === nextProps.outputType) {
                outputClass = "jqconsole-input";
                outputText += "\n";
            } else if ("stdout" === nextProps.outputType) {
                outputClass = "jqconsole-stdout";
            } else if ("stderr" === nextProps.outputType) {
                outputClass = "jqconsole-stderr";
            } else {
                outputText += "\n";
            }
            this.outputToConsole(outputText, outputClass);
        }
    },
    outputToConsole: function(outputText, outputClass) {
        this.state.theConsole.Write(outputText, outputClass);
    },
    render: function() {
        return (
            <div id="console"></div>
        );
    }
});

var Terminal = React.createClass({
    render: function() {
        return (
            <div className="ncoda-terminal">
                <h2>Terminal</h2>
                <TerminalConsole outputThis={this.props.outputThis}
                                 outputType={this.props.outputType}
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
        this.outputToTerminal(">>> " + thisText, "input");
        pypyjs.eval(thisText).then(this.outputToTerminal);
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

pypyjs.ready().then(function () {
    React.render(
        <NCoda />,
        document.getElementById("ncoda"));
    }
);
