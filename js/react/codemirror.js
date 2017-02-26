// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/codemirror.js
// Purpose:                React wrapper for the CodeMirror text editor widget.
//
// Copyright (C) 2016 Christopher Antila
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
//
// This React component is inspired by Jed Watson's MIT-licensed "react-codemirror," which is
// available on GitHub: https://github.com/JedWatson/react-codemirror/
//


import React from 'react';
import CodeMirror from 'codemirror';
// TODO: figure out how to do this without cheating like this
import '../../node_modules/codemirror/mode/python/python.js';
// import diff_match_patch from 'diff-match-patch';  // TODO: make this import here properly, instead of index.html
import '../../node_modules/codemirror/addon/merge/merge.js';


// IMPORTANT: This component is not being used for CodeScoreView, but is still being used for RevisionsView

/** CodeMirrorReactWrapper: React wrapper for the CodeMirror text editor widget.
 *
 * React Props:
 * ------------
 * @param {str} className - The "class" attribute for the <div> that will contain CodeMirror.
 * @param {func} onChange - When the CodeMirror text is changed, this function is called with
 *     the text editor's new value.
 *
 * CodeMirror Props:
 * ------------
 * @param {bool} autoFocus - Whether to focus CodeMirror after it's initialized (defaults to false).
 * @param {bool} electricChars - Something fancy with the indentation (defaults to true).
 * @param {int} indentUnit - Indent by this many tabs/spaces (defaults to 4).
 * @param {bool} indentWithTabs - Indent by indentUnit tabs instead of indentUnit spaces (defaults to false).
 * @param {bool} lineNumbers - Whether to show line numbers (defaults to true).
 * @param {bool} lineWrapping - Whether to use wraparound for long lines of text (defaults to false).
 * @param {str} mode - Text editor's highlighting/folding mode (defaults to "python").
 * @param {bool} smartIndent - I guess this avoids stupid indentation? (defaults to true).
 * @param {str} text - The initial text to show in the editor.
 * @param {str} theme - The text editor's visual theme (defaults to "codemirror-ncoda light").
 *
 * DiffView Props:
 * ---------------
 * @param {str} connect - Either "align" or an unknown value, dictating how to align the texts.
 * @param {bool} diff - When true, use the "MergeView" plugin to display a textual diff between
 *     two text passages. Defaults to false. Provide the texts to "leftText" and "rightText."
 * @param {str} leftText - The text to show on the left side of a diff.
 * @param {str} rightText - The text to show on the right side of a diff.
 *
 * State:
 * ------
 * @param {object} codemirror - The CodeMirror instance rendered inside this component.
 *
 */
const CodeMirrorReactWrapper = React.createClass({
    propTypes: {
        // React props
        className: React.PropTypes.string,
        onChange: React.PropTypes.func,

        // CodeMirror props
        autofocus: React.PropTypes.bool,
        electricChars: React.PropTypes.bool,
        indentUnit: React.PropTypes.number,
        indentWithTabs: React.PropTypes.bool,
        lineNumbers: React.PropTypes.bool,
        lineWrapping: React.PropTypes.bool,
        mode: React.PropTypes.string,
        smartIndent: React.PropTypes.bool,
        text: React.PropTypes.string,  // becomes "value" for CodeMirror
        theme: React.PropTypes.string,

        // DiffView props
        connect: React.PropTypes.string,
        diff: React.PropTypes.bool,
        leftText: React.PropTypes.string,  // becomes "origLeft" for CodeMirror
        rightText: React.PropTypes.string,  // becomes "value" for CodeMirror
    },
    getDefaultProps() {
        return {
            // React props
            className: '',

            // CodeMirror props
            autofocus: false,
            electricChars: true,
            indentUnit: 4,
            indentWithTabs: false,
            lineNumbers: true,
            lineWrapping: false,
            mode: 'python',
            smartIndent: true,
            text: '',
            theme: 'codemirror-ncoda light',

            // DiffView props
            connect: 'align',
            diff: false,
            leftText: '',
            rightText: '',
        };
    },
    getInitialState() {
        return {codemirror: null};
    },
    /** Format a set of "props" so they can be given to CodeMirror as "options."
     */
    propsToOptions(props) {
        const options = {
            // CodeMirror props
            autofocus: props.autofocus,
            electricChars: props.electricChars,
            indentUnit: props.indentUnit,
            indentWithTabs: props.indentWithTabs,
            lineNumbers: props.lineNumbers,
            lineWrapping: props.lineWrapping,
            mode: props.mode,
            smartIndent: props.smartIndent,
            value: props.text,
            theme: props.theme,
        };
        if (this.props.diff) {
            // DiffView props
            options.connect = props.connect;
            origLeft = props.leftText;
            value = props.rightText;
        }

        // set hardwired options
        options['revertButtons'] = false;  // for DiffView/MergeView
        options['readOnly'] = this.props.diff;  // no editing in DiffView
        options['scrollbarStyle'] = 'native';
        options['inputStyle'] = 'contenteditable';

        return options;
    },
    componentDidMount() {
        let codemirror;
        let editor;

        const options = this.propsToOptions(this.props);

        // initialize the text editor; different for DiffView and regular text editor
        if (this.props.diff) {
            codemirror = CodeMirror.MergeView(this.refs.codemirror, options);
            editor = codemirror.edit;
        }
        else {
            codemirror = CodeMirror(this.refs.codemirror, options);
            editor = codemirror;
        }

        // connect an "onChange"-like callback if requested
        if (this.props.onChange) {
            editor.on('change', this.onChange);  // call the "props" function indirectly
        }

        this.setState({codemirror: editor});
    },
    componentWillReceiveProps(nextProps) {
        // As much as possible, we want to allow props to take effect in render(). Unfortunately,
        // it's not possible for much!

        if (nextProps !== this.props) {
            // 1.) onChange
            // TODO

            // 2.) diff
            // TODO: allow changing "this.props.diff"
            if (nextProps.diff !== this.props.diff) {
                console.error("You can't change the 'diff' of the CodeMirror component; ignoring");
            }

            // 3.) options
            if (this.state.codemirror) {
                // idk why CodeMirror wouldn't be rendered yet, but now we know for sure
                const options = this.propsToOptions(nextProps);
                for (const key in options) {
                    // only update if it's different
                    if (options[key] !== this.state.codemirror.options[key]) {
                        if (key === 'origLeft') {
                            // simply setting "origLeft" again doesn't work
                            this.state.codemirror.state.diffViews[0].orig.setOption('value', options[key]);
                        }
                        else if (key === 'value') {
                            // TODO: temporary for T50?
                            // NOTE: aside from T50, we shouldn't be receiving a new "value"... ?
                            //       ... if we are, it moves the cursor, so that's not good for typing
                            if (this.state.codemirror.getOption(key) === '') {
                                this.state.codemirror.setOption(key, options[key]);
                            }
                        }
                        else {
                            this.state.codemirror.setOption(key, options[key]);
                        }
                    }
                }
            }
        }
    },
    shouldComponentUpdate(nextProps) {
        if (nextProps.className !== this.props.className) {
            return true;
        }
        return false;
    },
    componentWillUnmount() {
        delete this.state.codemirror;
    },
    onChange(doc) {
        if (this.props.onChange) {
            this.props.onChange(doc.getValue());
        }
    },
    render() {
        return <div className={this.props.className} ref="codemirror"/>;
    },
});


export {CodeMirrorReactWrapper as CodeMirror};
export default CodeMirrorReactWrapper;
