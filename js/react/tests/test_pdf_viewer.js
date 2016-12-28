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


import React from 'react';
import { shallow } from 'enzyme';

jest.unmock('../pdf_viewer');
import PDFViewer from '../pdf_viewer';

const pdffile = "./dummy_multi.pdf";
const containerclass = "custom-class";


describe('<PDFViewer>', () => {

    const wrapper = shallow(<PDFViewer file={pdffile} pdfContainerClass={containerclass}/>);

    it('has an outer div with the classname nc-pdfviewer', () => {
        // looking for nc-pdfviewer class on exactly one <div> element
        const pdfContainerDiv = wrapper.find(`.nc-pdfviewer`);
        expect(pdfContainerDiv.length).toBe(1);
        expect(pdfContainerDiv.name()).toBe('div');

    });

    it('uses the custom container class when provided', () => {
        // looking for containerclass on exactly one <div> element
        const customClassDiv = wrapper.find(`.${containerclass}`);
        expect(customClassDiv.length).toBe(1);
        expect(customClassDiv.name()).toBe('div');
        expect(customClassDiv.hasClass('nc-pdf')).toBe(true);  // also has the default class added
    });

    it('accepts a URL of a PDF via props', () => {
        expect(wrapper.instance().props.file).toBe(pdffile);
    });

    it('has a loadPDF method', () => {
        expect(wrapper.instance().loadPDF).toBeDefined();
    });

    it('has a downloadPDF method', () => {
        expect(wrapper.instance().downloadPDF).toBeDefined();
    });

    it('has a refresh method', () => {
        expect(wrapper.instance().refresh).toBeDefined();
    });

    it('has a button to download', () => {
        const downloadBtn = wrapper.find('.nc-pdf-download-btn');
        expect(downloadBtn.node.props.onClick).toBeDefined();
    });

    it('has a button to refresh', () => {
        const refreshBtn = wrapper.find('.nc-pdf-refresh-btn');
        expect(refreshBtn.node.props.onClick).toBeDefined();
    });

});
