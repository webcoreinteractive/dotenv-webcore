import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import json from "@rollup/plugin-json"

import pkg from './package.json'

const minifiedOutputs = [
	{
		file: pkg.exports['.'].default,
		format: 'es',
		sourcemap: false,
	},
	{
		file: pkg.exports['.'].require,
		format: 'cjs',
		sourcemap: false,
	},
]

const commonPlugins = [
	commonjs({
		extensions: ['.js', '.mjs', '.o.mjs'],
		requireReturnsDefault: 'auto',
	}),
	json(),
]

export default [
	{
		input: './src/index.mjs',
		output: [...minifiedOutputs],
		plugins: [
			...commonPlugins,
			resolve({
				preferBuiltins: true,
			}),
			terser(),
		],
		external: [/^@babel\/runtime\//],
	},
]