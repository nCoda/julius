// -*- coding: utf-8 -*-
//-------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/tests/stores_julius.js
// Purpose:                Tests for the "julius" NuclearJS Stores.
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


jest.dontMock('../julius/log');
const log = require('../julius/log');
jest.dontMock('../julius/stores/julius');
const setters = require('../julius/stores/julius').setters;


describe('setLogLevel()', () => {
    it('works on the four valid values', () => {
        expect(setters.setLogLevel(-12, log.LEVELS.ERROR)).toBe(log.LEVELS.ERROR);
        expect(setters.setLogLevel(-12, log.LEVELS.WARN)).toBe(log.LEVELS.WARN);
        expect(setters.setLogLevel(-12, log.LEVELS.INFO)).toBe(log.LEVELS.INFO);
        expect(setters.setLogLevel(-12, log.LEVELS.DEBUG)).toBe(log.LEVELS.DEBUG);
    });

    it('fails with some invalid values', () => {
        expect(setters.setLogLevel(-12, 400)).toBe(-12);
        expect(setters.setLogLevel(-12, '400')).toBe(-12);
        expect(setters.setLogLevel(-12, {a: 400})).toBe(-12);
        expect(setters.setLogLevel(-12, [4, 0, 0])).toBe(-12);
    });
});
