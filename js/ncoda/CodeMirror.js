// NOTICE
// I copied this file from the "react-codemirror" repository on GitHub (see link below). It didn't
// seem worth adding the project as a submodule, just to get a single file that I'll probably want
// to change anyway.
//
// Thus, the following file is Copyright (c) 2015 Jed Watson, included here according to the MIT license.
//
// A copy of the MIT license is available in this repository in the file called "MIT_license.txt"
//
// https://github.com/JedWatson/react-codemirror/blob/f0c0fc50d2226f4757ccae4a7736ca9911902d9d/src/Codemirror.js

var CM = require('codemirror');
var React = require('react');

var CodeMirror = React.createClass({

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
		this.codeMirror = CM.fromTextArea(this.refs.codemirror.getDOMNode(), this.props.options);
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

module.exports = CodeMirror;
