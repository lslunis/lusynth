'use strict'

let error = s =>
    new Error(s)

let For = (init, pred, next) => {
    let xs = init
    while (pred(...xs)) xs = next(...xs)
    return xs
}

let get = (xs, i, or) =>
    i < xs.length ? xs[i] : or !== undefined ? or : error()

let isInt = Number.isSafeInteger

let fix = (x, i) =>
    Math.round(x * i)

let now = () =>
    fix(performance.now(), 200)

let draw = term =>
    isInt(term) ? new Text(term) : error()

let world = 0

let drawFrame = t => {
    let frame = document.body
    frame.replaceChild(draw(world), frame.firstChild)
    requestFrame()
}

let requestFrame = () =>
    requestAnimationFrame(drawFrame)

requestFrame()
