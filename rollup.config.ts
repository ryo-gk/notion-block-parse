import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import buble from '@rollup/plugin-buble'
import ts from '@rollup/plugin-typescript'

export default {
  input: 'lib/index.ts',
  output: {
    name: 'NotionApiUtil',
    exports: 'named',
    sourcemap: true
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    buble(),
    ts()
  ]
}
