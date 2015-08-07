// This file starts nCoda

var TextEditor = React.createClass({
    submitToPyPy: function(changeEvent) {
        this.props.submitToPyPy(changeEvent.target[0].value);
        changeEvent.preventDefault();  // stop the default GET form submission
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
