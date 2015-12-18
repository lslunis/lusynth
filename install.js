#!/usr/bin/env node --harmony
'use strict'

let childProcess = require('child_process')
let fs = require('fs')

let packageElectron = require('electron-packager')


function exec(cmd, ...args) {
    childProcess.spawnSync(cmd, args, {stdio: 'inherit'})
}

let name = 'Lusynth'
let opts = {
    name,
    version: require('./package').devDependencies['electron-prebuilt'],
    platform: 'darwin',
    arch: 'x64',
    dir: '.',
    out: 'out',
    overwrite: true,
}

process.chdir(__dirname)
exec('jade', '.')
exec('stylus', '.')
packageElectron(opts, (err, dir) => {
    let app = `${name}.app`
    let path = `/Applications/${app}`
    exec('rm', '-rf', path)
    fs.renameSync(`${dir}/${app}`, path)
})
