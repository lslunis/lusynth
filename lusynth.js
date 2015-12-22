'use strict'

let error = s =>
    new Error(s)

let For = (init, pred, next) => {
    let xs = init
    while (pred(...xs)) xs = next(...xs)
    return xs
}

let get = (xs, i, or) =>
    0 <= i && i < xs.length ? xs[i] : or !== undefined ? or : error()

let last = xs =>
    get(xs, xs.length - 1)

let isInt = Number.isSafeInteger

let fix = (x, i) =>
    Math.round(x * i)

let div = (...xs) => {
    let d = document.createElement('div')
    for (let x of xs) {
        if (typeof x == 'string') d.classList.add(x)
        else d.appendChild(x)
    }
    return d
}

let focusClasses = t =>
    t == last(caret) ? ['focus'] : []

let text = (s, classes) =>
    div('text', ...classes, new Text(s))

class Term {
    sub() {
        throw error()
    }

    eval() {
        return {v: this, d: this.draw()}
    }
}

class Int extends Term {
    constructor(i) {
        super()
        this.i = i
    }

    draw() {
        return text(this.i, focusClasses(this))
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
        return div('func', ...focusClasses(this), this.t.draw())
    }
}

let func = t =>
    new Func(t)

let callDiv = (c, f, x, r) =>
    div(
        'call', ...focusClasses(c),
        div('f', f), div('x', x), ...(r ? [div('r', r)] : []))

class Call extends Term {
    constructor(f, x) {
        super()
        this.f = f
        this.x = x
    }

    draw() {
        return callDiv(this, this.f.draw(), this.x.draw())
    }

    eval() {
        let f = this.f.eval()
        let x = {v: this.x, d: this.x.draw()}
        let r = f.v.sub(x.v).eval()
        return {v: r.v, d: callDiv(this, f.d, x.d, r.d)}
    }
}

let call = (f, x) =>
    new Call(f, x)

let code = call(call(func(func(call(func(int(0)), int(3)))), int(2)), int(1))
let caret = [code]
let input = []

let drawFrame = t => {
    let frame = document.body
    frame.replaceChild(code.eval().d, frame.firstChild)
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
