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
            var outputText = nextProps.outputThis + "\n";
            var outputClass = "jqconsole-output";
            if (nextProps.thisIsInput) {
                outputClass = "jqconsole-input";
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
                                 thisIsInput={this.props.thisIsInput}
                                 />
            </div>
        );
    }
});

var NCoda = React.createClass({
    getInitialState: function() {
        return ({sendToConsole: "nCoda is ready for action!", sendingInputToConsole: false});
    },
    componentDidMount: function() {
        pypyjs.stdout = this.outputToTerminal;
        pypyjs.stderr = this.outputToTerminal;
    },
    submitToPyPy: function(thisText) {
        if ("" === thisText || undefined === thisText) {
            return;
        }
        this.outputToTerminal('>>> ' + thisText, true);
        pypyjs.eval(thisText).then(this.outputToTerminal);
    },
    outputToTerminal: function(thisText, thisIsInput) {
        // Sets state so the Terminal component will output something new.
        // - thisText (str): the new text that should be added to the terminal
        // - thisIsInput (bool): whether this the text was inputted by the user (default is false)
        if (null === thisText) {
            return;
        }
        if (true !== thisIsInput) {
            thisIsInput = false;
        }
        this.setState({sendToConsole: thisText, sendingInputToConsole: thisIsInput});
    },
    render: function() {
        return (
            <div className="ncoda">
                <TextEditor submitToPyPy={this.submitToPyPy} />
                <Terminal outputThis={this.state.sendToConsole}
                          thisIsInput={this.state.sendingInputToConsole}
                          />
            </div>
        );
    }
});

//

pypyjs.ready().then(React.render(
    <NCoda />,
    document.getElementById("ncoda")
));
