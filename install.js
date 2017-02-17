#!/usr/bin/env node
'use strict'

let name = 'Lusynth'
let opts = {
    name,
    dir: '.',
    out: 'out',
    overwrite: true,
}

process.chdir(__dirname)
require('electron-packager')(opts, (err, dir) => {
    if (err) throw err
    let app = `${name}.app`
    let path = `/Applications/${app}`
    require('child_process').spawnSync('rm', ['-rf', path], {stdio: 'inherit'})
    require('fs').renameSync(`${dir}/${app}`, path)
})
