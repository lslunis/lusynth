#!/usr/bin/env node --harmony
'use strict'

let childProcess = require('child_process')
let fs = require('fs')

let jade = require('jade')
let packageElectron = require('electron-packager')


process.chdir(__dirname)
let name = 'Lusynth'
fs.writeFileSync('index.html', jade.renderFile('index.jade', {name}))

let opts = {
    name,
    version: require('./package').devDependencies['electron-prebuilt'],
    platform: 'darwin',
    arch: 'x64',
    dir: '.',
    out: 'out',
    overwrite: true,
}
packageElectron(opts, (err, dir) => {
    let app = `${name}.app`
    let path = `/Applications/${app}`
    childProcess.execSync(`rm -rf ${path}`)
    fs.renameSync(`${dir}/${app}`, path)
})
