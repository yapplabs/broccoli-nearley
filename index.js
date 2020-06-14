const Filter = require('broccoli-persistent-filter');
const nearley = require('nearley/lib/nearley.js');
const compile = require('nearley/lib/compile.js');
const generate = require('nearley/lib/generate.js');
const lint = require('nearley/lib/lint');
const rawGrammar = require('nearley/lib/nearley-language-bootstrapped.js');

module.exports = class BroccoliNearley extends Filter {
  constructor(inputNode, options = {}) {
    super(inputNode, {
      annotation: options.annotation
    });
    this.extensions = ['ne'];
    this.targetExtension = 'js';
    this.nearleyGrammar = nearley.Grammar.fromCompiled(rawGrammar);
  }

  processString(content, relativePath) {
    let parser = new nearley.Parser(this.nearleyGrammar);
    parser.feed(content);
    let compilation = compile(parser.results[0], {file: relativePath});
    lint(compilation, {});
    return generate.module(compilation, 'grammar');
  }
}
