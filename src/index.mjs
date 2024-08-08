import path from 'node:path'
import { config, decrypt, parse } from 'dotenv'
import { expand } from 'dotenv-expand'

const convertRegExp = /(?<content>.*)::(?<type>\w*)$/

const defaultCfg = path.resolve(process.cwd(), '.env.default')
const environmentCfg = path.resolve(process.cwd(), `.env.${process.env.BASE_CONFIG_ENV || process.env.CONFIG_ENV || 'development'}`)

const convert = (str, funcs) => {
	
	if(!convertRegExp.test(str))
		return str

	const { type, content } = convertRegExp.exec(str).groups
	
	switch(type){
		case 'number':
		case 'int':
		case 'float':
			return +content
		case 'bool':
			let parsedBool = undefined
			try{
				parsedBool = JSON.parse(content)
			}catch(e){}
			return !!parsedBool
		case 'json':
			let parsed = undefined
			try{
				parsed = JSON.parse(content)
			}catch(e){}
			return parsed
		case 'date':
			return new Date(content)
		default:
			return funcs[type](content)
	}

}

const convertall = (env) => {

	if(!env && ("object" == typeof process) && process?.env)
		env = process.env

	if(typeof env != "object")
		return {}

	let ret = {}

	for(const key in env)
		ret[key] = convert(env[key])

	return ret

}

const load = (cfg = {}, funcs = {}) => {
	
	const loadedDefault = expand(config({ path: defaultCfg }))
	const loadedEnv = expand(config({ path: environmentCfg, ...cfg }))

	const combined = { ...loadedDefault.parsed, ...loadedEnv?.parsed }

	let ret = convertall(combined)

	return ret

}

export default { config, decrypt, parse, expand, load, convert, convertall }
export { config, decrypt, parse, expand, load, convert, convertall }
