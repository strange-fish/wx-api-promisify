import commonjs from 'rollup-plugin-commonjs'
import nodejs from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import builtins from 'rollup-plugin-node-builtins'
import json from 'rollup-plugin-json'
import { terser } from "rollup-plugin-terser"

export default {
  input: 'src/wxp.js',
  plugins: [
    builtins(),
    babel({
      exclude: ['node_modules/**']
    }),
    json(),
    nodejs(),
    commonjs(),
    terser()
  ],
  output: {
    file: 'dist/wxp.js',
    format: 'umd',
    name: 'wxp',
  },
}
