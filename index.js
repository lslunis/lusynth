'use strict'

let electron = require('electron')
let app = electron.app
let BrowserWindow = electron.BrowserWindow

let win = null

app.on('ready', () => {
  win = new BrowserWindow({x: 0, y: 0, width: 600, height: 1600})
  win.loadURL(`file://${__dirname}/index.html`)
  win.webContents.openDevTools()
  win.on('closed', () =>
    win = null)
})

app.on('window-all-closed', () =>
    app.quit())
