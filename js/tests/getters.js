// React components for Julius, the nCoda user interface
//
// File Name: js/julius/tests/getters.js
// Purpose: Tests for the Julius NuclearJS "getters."
//
// Copyright 2015 Christopher Antila

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
