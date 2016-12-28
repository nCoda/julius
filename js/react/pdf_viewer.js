// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/pdf_viewer.js
// Purpose:                React wrapper for PDF display with PDF.js.
//
// Copyright (C) 2016 Sienna M. Wood
//
// The MIT License (MIT)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// ------------------------------------------------------------------------------------------------
//
// This React component is inspired by javascriptiscoolpl's MIT-licensed "npm-simple-react-pdf,"
// which is available on GitHub: https://github.com/javascriptiscoolpl/npm-simple-react-pdf
//


import React from 'react';
import ReactDOM from 'react-dom';
import PDFJS from 'pdfjs-dist/build/pdf.combined';
import {ButtonGroup, Button} from 'amazeui-react';


export default class PDFViewer extends React.Component {

    constructor(props) {
        super(props);

        this.downloadPDF = this.downloadPDF.bind(this);
        this.refresh = this.refresh.bind(this);
        this.loadPDF = this.loadPDF.bind(this);
    }

    downloadPDF() {
        let uri = '';
        if(this.props.file.startsWith('http')) { // if an absolute URL, no changes needed
            uri = this.props.file;
        } else { // prefix with base uri if needed
            uri = document.baseURI;
            uri = uri.slice(0, uri.lastIndexOf('.')); // slice off '.html#/...'
            uri = uri.slice(0, uri.lastIndexOf('/') + 1); // slice off anything after final /
            uri = uri + this.props.file
        }

        let tempLink = document.createElement('a');
        tempLink.href = uri;
        tempLink.setAttribute('download', 'ncoda-pdf.pdf');
        tempLink.click();
    }

    refresh() {
        this.forceUpdate();
        console.log("PDF display reloaded.")
    }

    loadPDF() {
        const node = ReactDOM.findDOMNode(this).getElementsByClassName(this.props.pdfContainerClass)[0];
        node.innerHTML = "PDF loading...";

        PDFJS.getDocument(this.props.file)
            .then((pdf) => {

                node.innerHTML = "";
                let id = 1;

                for (let i = 1; i <= pdf.numPages; i++) {

                    pdf.getPage(i).then((page) => {

                        let canvas = document.createElement('canvas');
                        canvas.id = "page-" + id;
                        id++;

                        // scale = 1, actual display dimensions controlled by styles
                        let viewport = page.getViewport(1);
                        canvas.width = viewport.width;
                        canvas.height = viewport.height;

                        node.appendChild(canvas);

                        let renderContext = {
                            canvasContext: canvas.getContext('2d'),
                            viewport: viewport
                        };
                        page.render(renderContext);
                    });
                }
            })
            .catch((error) => {
                console.error('PDF could not be displayed.', error);
                node.innerHTML = "Sorry, there was an error and the PDF could not be displayed.";
            });
    }

    render() {
        let classes = this.props.pdfContainerClass;
        if(classes != "nc-pdf"){
            classes = classes + " nc-pdf";
        }
        return (
            <div className="nc-pdfviewer">
                <ButtonGroup className="nc-pdfviewer-btns">
                    <Button amSize="sm"
                            title="Download PDF"
                            className="nc-pdf-download-btn"
                            onClick={() => this.downloadPDF()}>
                        <i className="am-icon-download"></i>
                    </Button>
                    <Button amSize="sm"
                            title="Refresh PDF"
                            className="nc-pdf-refresh-btn"
                            onClick={() => this.refresh()}>
                        <i className="am-icon-refresh"></i>
                    </Button>
                </ButtonGroup>
                <div className={classes}></div>
            </div>
        );
    }

    componentDidMount() {
        this.loadPDF();
    }

    shouldComponentUpdate(nextProps) {
        return this.props.file != nextProps.file
    }

    componentDidUpdate() {
        this.loadPDF();
    }
}

PDFViewer.propTypes = {
    file: React.PropTypes.string.isRequired,
    pdfContainerClass: React.PropTypes.string
};

PDFViewer.defaultProps = {
    pdfContainerClass: "nc-pdf"
};
