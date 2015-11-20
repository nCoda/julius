// -*- coding: utf-8 -*-
//-------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/tests/getters.js
// Purpose:                Tests for the NuclearJS "getters."
//
// Copyright (C) 2015 Christopher Antila
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


jest.dontMock('nuclear-js');
jest.dontMock('../julius/getters.src');

const Immutable = require('nuclear-js').Immutable;

// MUT: module under test
const MUT = require('../julius/getters.src');


describe('stdioConcatter()', () => {
    it('works with an empty List', () => {
        let input = Immutable.List([]);
        let expected = '';
        expect(MUT.stdioConcatter(input)).toBe(expected);
    });

    it('works with an empty List', () => {
        let input = Immutable.List(['1', '2', '3']);
        let expected = '1\n2\n3';
        expect(MUT.stdioConcatter(input)).toBe(expected);
    });
});
