const path = require('path')
const { config, decrypt, parse } = require('dotenv')
const { expand } = require('dotenv-expand')

const convertRegExp = /(?<content>.*)::(?<type>\w*)$/

const defaultCfg = path.resolve(process.cwd(), '.env.default')
const environmentCfg = path.resolve(process.cwd(), `.env.${process.env.CONFIG_ENV || 'development'}`)

const convert = (str, funcs) => {
	
	if(!convertRegExp.test(str))
		return str

	const { type, content } = convertRegExp.exec(str).groups
	
	switch(type){
		case 'number':
		case 'int':
		case 'float':
			return +content
		case 'json':
			return JSON.parse(content)
		case 'date':
			return new Date(content)
		default:
			return funcs[type](content)
	}

}

const load = (cfg = {}, funcs = {}) => {
	
	const loadedDefault = expand(config({ path: defaultCfg }))
	const loadedEnv = expand(config({ path: environmentCfg, ...cfg }))

	const combined = { ...loadedDefault.parsed, ...loadedEnv?.parsed }

	let ret = {}

	for(const key in combined)
		ret[key] = convert(combined[key])

	return ret

}

exports.config = config
exports.decrypt = decrypt
exports.parse = parse
exports.expand = expand
exports.load = load
exports.convert = convert
