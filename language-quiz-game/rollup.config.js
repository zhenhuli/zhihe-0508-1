import vue from 'rollup-plugin-vue';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import css from 'rollup-plugin-css-only';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    name: 'app',
    sourcemap: true
  },
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development')
    }),
    vue({
      css: false,
      compileTemplate: true
    }),
    css({
      output: 'bundle.css'
    }),
    resolve({
      browser: true,
      dedupe: ['vue']
    }),
    commonjs(),
    !production && serve({
      contentBase: ['dist', 'public'],
      host: 'localhost',
      port: 3000
    }),
    !production && livereload('dist')
  ]
};
