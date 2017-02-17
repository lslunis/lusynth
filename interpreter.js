'use strict'

const infix = op => {
	const self = {
		call: ([a, b], {compiled}) =>
			compiled ? `(${a} ${op} ${b})` : eval('a ${op} b'),
		eval: scope => self,
	}
	return self
}

const staticScope = {
	add: infix('+'),
}

const Z = new Proxy({}, {
	apply: (_, _, [callee, ...args]) => {Z, callee, args, f: Z, v: Z}},
	get: (_, name) => {Z, name},
})

const parse = s => eval(s.trim()
	.replace(/\s+/g, ',$0')
	.replace(/[a-z]+/gi, 'Z.$0')
	.replace(/\(/g, ' Z('))

const program = parse(`

(add (add 1 2) 4)

`)

const getLast = xs => xs[xs.length - 1]

const isReducible = term => Array.isArray(term)

const isSpecial = term => term.Z == Z

const isSpecialWith = prop => term => isSpecial(term) && term[prop]

const isCall = term => isSpecialWith('args')

const isName = term => isSpecialWith('name')

const isFn = term => isSpecialWith('body')

const addScope = (term, scope) => Object.assign(term, {scope})

const getResolver = compiled => {
	const resolveArgs = args => args.map(resolver.resolve)
	const resolver = compiled ? {
		resolveCallee: (callee, args) => {
			const resolvedArgs = resolveArgs(args)
			const op = isName(callee) ? staticScope[callee.name] : undefined
			return op
				? 
				: `${resolver.resolve(callee)}(${resolvedArgs.join(',')})`
		},
		resolve: term => isCall(term)
			? resolver.resolveCallee(term.callee, term.args)
			: isName(term) ? term.name : JSON.stringify(term)
	} : {
		resolveCallee: (callee, args) => ,
		resolve: (term, scope) =>
			isFn(term) ? addScope(term, scope)
			: isName(term) ? scope[term.name] : term
	}
	return resolver
}


const reduceTerm = ([...subterms]) => {
	const [fn, ...args] = subterms
	if (!fn.w) return Z.error
	switch (fn.w) {
		case Z.add.w:
			const reducibleIndex = subterms.findIndex(isReducible)
			if (reducibleIndex >= 0) {
				subterms[reducibleIndex] = reduceTerm(subterms[reducibleIndex])
				return subterms
			}
			const [m, n] = args
			return m + n
		default:
			return Z.error
	}
}

const reducedTerms = [program]
while (isReducible(getLast(reducedTerms))) {
	reducedTerms.push(reduceTerm(getLast(reducedTerms)))
}

document.body.textContent = JSON.stringify(reducedTerms, null, 1)
