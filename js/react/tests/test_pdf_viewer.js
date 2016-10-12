// -*- coding: utf-8 -*-
//-------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/react/tests/test_pdf_viewer.js
// Purpose:                Tests for the the PDFViewer React component (js/react/pdf_viewer.js).
//
// Copyright (C) 2016 Sienna M. Wood
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
//-------------------------------------------------------------------------------------------------


// don't need these nuclear things now, but may need them later
// import {init} from '../../nuclear/init';
// import nuclear from 'nuclear-js';
//
// import reactor from '../../nuclear/reactor';
// import signals from '../../nuclear/signals';
// import getters from '../../nuclear/getters';

import React from 'react';
import ReactDOM from 'react-dom';
import {mount, shallow} from 'enzyme';

jest.unmock('../pdf_viewer');
import PDFViewer from '../pdf_viewer';

jest.unmock('pdfjs-dist/build/pdf.combined.js');
import PDF from 'pdfjs-dist/build/pdf.combined.js';

const pdffile = "dummy_multi.pdf";
const pdfpagecount = 2; // the number of pages of pdffile
const containerclass = "custom-class";
const mockedpdfobject = {
    pageInfo: {
        view: [0, 0, 612, 792]
    },
    rotate: 0
};

describe('<PDFViewer>', () => {

    const wrapper = shallow(<PDFViewer file={pdffile} pdfContainerClass={containerclass}/>);
    console.log(wrapper.instance());

    it('has an outer div with the classname nc-pdfviewer', () => {
        expect(wrapper.node.type).toBe('div');
        expect(wrapper.node.props.className).toBe('nc-pdfviewer');
    });

    it('accepts a URL of a PDF via props', () => {
        expect(wrapper.instance().props.file).toBe(pdffile);
    });

    it('accepts a class name for the PDF container via props', () => {
        expect(wrapper.instance().props.pdfContainerClass).toBe(containerclass);
    });

    loadPDF.mockImplementation(() => mockedpdfobject);

    it('can call loadPDF', () => {
       wrapper.instance().loadPDF(pdffile);
    });

    // it('works with async/await', async () => {
    //     const mwrapper = await mount(<PDFViewer file={pdffile} pdfContainerClass={containerclass}/>);
    //     expect(mwrapper.find('canvas').length).toBe(pdfpagecount);
    // });

});


// PDF.numPages.mockImplementation(() => pdfpagecount);
// PDF.getPage(n).mockImplementation( function(n) {
//     return mockedpdfobject[n]
// });


// await const wrapper = mount(<PDFViewer file={pdffile} pdfContainerClass={containerclass}/>);
// wrapper.instance().loadPDF(pdffile);

// mount(<PDFViewer file={pdffile} pdfContainerClass={containerclass}/>).then( function (node) {
//     console.log(node);
// });


// The promise that is being tested should be returned.
// it('works with promises', () => {
//     pdfviewerwrap.loadPDF(pdffile).then( function (node) {
//         expect(node.props.file).toBe(pdffile);
//         expect(node.props.pdfContainerClass).toBe(containerclass);
//         expect(node.find('canvas').length).toEqual(pdfpagecount);
//     })
// });
//

