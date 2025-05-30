import path from 'node:path'
import { config, decrypt, parse } from 'dotenv'
import { expand } from 'dotenv-expand'

const convertRegExp = /(?<content>.*)::(?<type>\w*)$/

const convert = (str, funcs = {}) => {
	
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
			return funcs && funcs[type] ? funcs[type](content) : str
	}

}

const convertall = (env, funcs = {}) => {

	if(!env && ("object" == typeof process) && process?.env)
		env = process.env

	if(typeof env != "object")
		return {}

	let ret = {}

	for(const key in env)
		ret[key] = convert(env[key], funcs)

	return ret

}

const load = (cfg = {}, funcs = {}, cwd = null) => {
	
	const systemEnv = "object" == typeof process && process?.env ? { ...process.env } : {}

	if(typeof SOURCE_PATH != 'undefined')
		cwd = SOURCE_PATH

	if(!cwd)
		cwd = process.cwd()

	const defaultCfg = path.resolve(cwd, '.env.default')
	const environmentCfg = path.resolve(cwd, `.env.${process.env.BASE_CONFIG_ENV || process.env.CONFIG_ENV || 'development'}`)

	const loadedDefault = expand(config({ path: defaultCfg }))
	const loadedEnv = expand(config({ path: environmentCfg, ...cfg }))

	const combined = { ...systemEnv, ...loadedDefault.parsed, ...loadedEnv?.parsed }

	let ret = convertall(combined, funcs)

	return ret

}

export default { config, decrypt, parse, expand, load, convert, convertall }
export { config, decrypt, parse, expand, load, convert, convertall }
