import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import json from "@rollup/plugin-json"

import pkg from './package.json'

const minifiedOutputs = [
	{
		file: pkg.exports['.'].default,
		format: 'esm',
	},
	{
		file: pkg.exports['.'].require,
		format: 'cjs',
	},
]

const commonPlugins = [
	commonjs(),
	json(),
]

export default [
	{
		input: './src/index.js',
		output: [...minifiedOutputs],
		plugins: [
			...commonPlugins,
			resolve(),
			terser(),
		],
		external: [/^@babel\/runtime\//],
	},
]