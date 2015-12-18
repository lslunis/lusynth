#!/usr/bin/env node --harmony
'use strict'

let childProcess = require('child_process')


function exec(cmd, ...args) {
    childProcess.spawn(cmd, args, {stdio: 'inherit'})
}

process.chdir(__dirname)
exec('jade', '-w', '.')
exec('stylus', '-w', '.')
exec('electron', '.')
