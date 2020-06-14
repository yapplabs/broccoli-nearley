const lint = require('mocha-eslint');

const paths = [
  'index.js',
  'tests/**/*.js'
];

lint(paths);
