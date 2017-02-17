// inject diffById

// determine which event logs to parse based on snapshot version
// read, decompress if rotated else ]-terminate, JSON.parse

let listen = (target, type, listener) =>
    new Promise(resolve =>
        target.addEventListener(type, e => resolve(listener(e))))

let pBody = listen(window, 'DOMContentLoaded', e => document.body)

function* counter() {
    for (let i = 0;;) yield i++
}

let [eventTypeSync, eventTypeText] = counter()
let eventTypeOf = e => e.$


function* replayEvents() {
    let body = yield pBody

    for (let pEvent of db.event[thisAppId].start(snapshotVersion)) {
        let e = yield pEvent
        if (eventTypeOf(e) == eventTypeSync) {
            e.
        }
        let d = diffById.get(e.i) || noDiff

    }
    // return promise map<note id, note text>
}


let formatters = new Set([
    'bold', 'italic', 'underline', 'strikeThrough', 'superscript', 'subscript'])

let dirtyIds = new Set

addEventListener('keydown', e => {
    if (e.which == 13) e.preventDefault()
})

addEventListener('beforeinput', e => {
    if (formatters.includes(e.inputType)) e.preventDefault()
})

addEventListener('input', e => {
    let {id} = e.target
    if (id) {
        dirtyIds.add(id)
    }
})


    let node = e.target
    let id = node.dataset.i
    let oldText = node.dataset.s
    let text = node.textContent
    // log the diff
    // if id == nextId, create next node
})


let assert = cond => {
    if (!cond) debugger
}
