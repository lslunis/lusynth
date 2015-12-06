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

let row = (...xs) => {
    if (xs.length == 1) return xs[0].draw()
    let r = document.createElement('div')
    r.classList.add('row')
    for (let x of xs) r.appendChild(x.draw())
    return r
}

class Lit {
    constructor(s) {
        this.s = s
    }

    draw() {
        return new Text(this.s)
    }
}

let lit = s =>
    new Lit(s)

class Int {
    constructor(i) {
        this.i = i
    }

    draw() {
        return row(lit(this.i))
    }
}

let int = i =>
    new Int(i)

class Func {
    constructor(t) {
        this.t = t
    }

    draw() {
        return row(lit('λ'), this.t)
    }
}

let func = t =>
    new Func(t)

class Call {
    constructor(f, x) {
        this.f = f
        this.x = x
    }

    draw() {
        return row(lit('('), this.f, lit(' '), this.x, lit(')'))
    }
}

let call = (f, x) =>
    new Call(f, x)

let code = call(func(int(0)), int(1))

let input = []

let drawFrame = t => {
    let frame = document.body
    frame.replaceChild(code.draw(), frame.firstChild)
    requestFrame()
}

let requestFrame = () =>
    requestAnimationFrame(drawFrame)

requestFrame()

let pushInput = (e, key) =>
    input.push({
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        key,
        metaKey: e.metaKey,
        location: e.location,
        repeat: e.repeat,
        shiftKey: e.shiftKey,
        timeStamp: e.timeStamp,
    })

addEventListener('keydown', e => {
    let key = e.keyIdentifier
    if (key.includes('+')) {
        key = {
            'U+0008': 'Backspace',
            'U+0009': 'Tab',
            'U+0010': 'ContextMenu',
            'U+001B': 'Escape',
            'U+007F': 'Delete',
        }[key]
        if (!key) return
    }
    if (key == 'Backspace' || key == 'Tab') e.preventDefault()
    pushInput(e, key)
})

addEventListener('keypress', e => {
    if (e.which >= 32) pushInput(e, String.fromCharCode(e.which))
})
