'use strict'

let error = () =>
    new Error()

let For = (init, pred, next) => {
    let args = init
    while (pred(...args)) args = next(...args)
    return args
}

let get = (list, i, or) =>
    i < list.length ? list[i] : or !== undefined ? or : error()

let isInt = Number.isSafeInteger

let draw = term =>
    isInt(term) ? new Text(term) : error()

let world = 0

requestAnimationFrame(t => {
    let old = document.getElementById('frame')
    let frame = draw(world)
    frame.id = old.id
    document.body.replaceChild(frame, old)
})
