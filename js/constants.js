// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/constants.js
// Purpose:                Constants...
//
// Copyright (C) 2017 Christopher Antila
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

import Immutable from 'immutable';
import React from 'react';

// NOTE: This file MUST NOT import any other files, in order to avoid dependency problems.

export const LANGUAGES = {
    LILYPOND: 'LilyPond language',
    MEI: 'MEI language',
    PYTHON: 'Python language',
};

// we only need Immutable until Object.values() is supported in our runtime
export const LANGUAGES_PROPTYPE = React.PropTypes.oneOf(Immutable.Map(LANGUAGES).toArray());
