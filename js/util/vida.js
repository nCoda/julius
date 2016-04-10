// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/util/vida.js
// Purpose:                Interface between various nCoda components and the Vida6 library.
//
// Copyright (C) 2016 Andrew Horwitz
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

import {VidaController, VidaView} from '../lib/vida';

export const vidaView = VidaView;
export const vidaController = new VidaController({
    'workerLocation': 'js/lib/verovioWorker.js',
    'verovioLocation': '../verovio-toolkit-0.9.9.js'
});