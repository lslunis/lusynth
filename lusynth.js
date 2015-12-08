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

let box = (...xs) => {
    let b = document.createElement('div')
    for (let x of xs) b.appendChild(x)
    return b
}

let col = (...xs) =>
    box(...xs.map(x => box(x)))


let row = (...xs) => {
    let r = box(...xs)
    r.classList.add('row')
    return r
}

let text = s =>
    new Text(s)

class Term {
    eval() {
        return this
    }

    sub() {
        throw error()
    }
}

class Int extends Term {
    constructor(i) {
        super()
        this.i = i
    }

    draw() {
        return text(this.i)
    }
}

let int = i =>
    new Int(i)

class Func extends Term {
    constructor(t) {
        super()
        this.t = t
    }

    sub(x) {
        return this.t
    }

    draw() {
        return row(text('λ'), this.t.draw())
    }
}

let func = t =>
    new Func(t)

class Call extends Term {
    constructor(f, x) {
        super()
        this.f = f
        this.x = x
    }

    eval() {
        return this.f.eval().sub(this.x)
    }

    draw() {
        return col(
            row(text('('), this.f.draw(), text(' '), this.x.draw(), text(')')),
            this.eval().draw())
    }
}

let call = (f, x) =>
    new Call(f, x)

let code = call(call(func(func(int(0))), int(2)), int(1))

let input = []

let drawFrame = t => {
    let frame = document.body
    frame.replaceChild(code.draw(), frame.firstChild)
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
