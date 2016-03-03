// -*- coding: utf-8 -*-
//-------------------------------------------------------------------------------------------------
// Program Name:           Julius
// Program Description:    User interface for the nCoda music notation editor.
//
// Filename:               js/electron_main.js
// Purpose:                Code to start nCoda Julius in Electron.
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
//-------------------------------------------------------------------------------------------------

'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const menu = require('menu');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function() {
    mainWindow = new BrowserWindow({width: 800, height: 600});
    mainWindow.loadURL('file://' + __dirname + '/../index.html');
    mainWindow.on('closed', function() {
        mainWindow = null;
    });

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
});


var menuTemplate = [
    {
        label: 'nCoda',
        submenu: [
            {
                label: 'Toggle Electron Developer Tools',
                accelerator: (function() {
                    if (process.platform === 'darwin')
                    return 'Alt+Command+I';
                    else
                    return 'Ctrl+Shift+I';
                })(),
                click: function(item, focusedWindow) {
                    if (focusedWindow)
                    focusedWindow.toggleDevTools();
                }
            },
            {
                label: 'Reload nCoda',
                accelerator: 'F5',
                click: function(item, focusedWindow) {
                    if (focusedWindow)
                        focusedWindow.reload();
                }
            },
            {
                type: 'separator',
            },
            {
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                role: 'close',
            },
        ],
    },
];

if (process.platform == 'darwin') {
    var name = 'nCoda';
    menuTemplate.unshift({
        label: name,
        submenu: [
            {
                label: 'About ' + name,
                role: 'about'
            },
            {
                type: 'separator'
            },
            {
                label: 'Services',
                role: 'services',
                submenu: []
            },
            {
                type: 'separator'
            },
            {
                label: 'Hide ' + name,
                accelerator: 'Command+H',
                role: 'hide'
            },
            {
                label: 'Hide Others',
                accelerator: 'Command+Alt+H',
                role: 'hideothers'
            },
            {
                label: 'Show All',
                role: 'unhide'
            },
            {
                type: 'separator'
            },
            {
                label: 'Quit',
                accelerator: 'Command+Q',
                click: function() { app.quit(); }
            },
        ]
    });
    // Window menu.
    // menuTemplate[3].submenu.push(
    //     {
    //         type: 'separator'
    //     },
    //     {
    //         label: 'Bring All to Front',
    //         role: 'front'
    //     }
    // );
}

var ncodaMenu = menu.buildFromTemplate(menuTemplate);
menu.setApplicationMenu(ncodaMenu);
