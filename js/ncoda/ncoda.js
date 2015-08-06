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

var Terminal = React.createClass({
    render: function() {
        return (
            <div className="ncoda-terminal">
                <h2>Terminal</h2>
                <textarea name="terminal" rows="20" cols="83" value={this.props.value} />
            </div>
        );
    }
});

var NCoda = React.createClass({
    getInitialState: function() {
        return ({terminalText: "nCoda is ready for action!"});
    },
    componentDidMount: function() {
        pypyjs.stdout = this.outputToTerminal;
        pypyjs.stderr = this.outputToTerminal;
    },
    submitToPyPy: function(thisText) {
        if ("" === thisText || undefined === thisText) {
            return;
        }
        this.outputToTerminal('>>> ' + thisText);
        pypyjs.eval(thisText).then(this.outputToTerminal);
    },
    outputToTerminal: function(thisText) {
        this.setState({terminalText: this.state.terminalText + "\n" + thisText});
    },
    render: function() {
        return (
            <div className="ncoda">
                <TextEditor submitToPyPy={this.submitToPyPy} />
                <Terminal value={this.state.terminalText} />
            </div>
        );
    }
});

//

pypyjs.ready().then(React.render(
    <NCoda />,
    document.getElementById("ncoda")
));
