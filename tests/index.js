const expect = require('chai').expect;
const helpers = require('broccoli-test-helper');
const { createBuilder, createTempDir } = helpers;
const BroccoliNearley = require('../');

describe('BroccoliNearley', function() {
  let input;

  beforeEach(async function() {
    let tempDir = await createTempDir();
    input = tempDir;
  });

  afterEach(function() {
    return input.dispose();
  });

  it('should build', async function() {
    input.write({
      // Your fixture directory structure
      "stackpath.ne": `
# Stack path parser
FullPath -> "/yapp" StackpathEntry:+ {% d => d[1].map(n => n[0]) %}
StackpathEntry -> ModelSegment | UtilitySegment
ModelSegment -> "/" NamedItem "/" Uuid {% d => { return { name: d[1], id: d[3] } } %}
UtilitySegment -> "/" NamedItem {% d => { return { name: d[1] } } %}
NamedItem -> [a-z-]:+ {% d => d[0].join('') %}
Uuid -> [a-f0-9-]:+ {% d => d[0].join('') %}
      `
    });

    let node = new BroccoliNearley(input.path(), {
      // Options
    });
    const output = createBuilder(node);
    await output.build();

    expect(output.read()).to.deep.equal({
      // Your transformed directory structure
      "stackpath.js": `// Generated automatically by nearley, version unknown
// http://github.com/Hardmath123/nearley
function id(x) { return x[0]; }
let Lexer = undefined;
let ParserRules = [
    {"name": "FullPath$string$1", "symbols": [{"literal":"/"}, {"literal":"y"}, {"literal":"a"}, {"literal":"p"}, {"literal":"p"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FullPath$ebnf$1", "symbols": ["StackpathEntry"]},
    {"name": "FullPath$ebnf$1", "symbols": ["FullPath$ebnf$1", "StackpathEntry"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "FullPath", "symbols": ["FullPath$string$1", "FullPath$ebnf$1"], "postprocess": d => d[1].map(n => n[0])},
    {"name": "StackpathEntry", "symbols": ["ModelSegment"]},
    {"name": "StackpathEntry", "symbols": ["UtilitySegment"]},
    {"name": "ModelSegment", "symbols": [{"literal":"/"}, "NamedItem", {"literal":"/"}, "Uuid"], "postprocess": d => { return { name: d[1], id: d[3] } }},
    {"name": "UtilitySegment", "symbols": [{"literal":"/"}, "NamedItem"], "postprocess": d => { return { name: d[1] } }},
    {"name": "NamedItem$ebnf$1", "symbols": [/[a-z-]/]},
    {"name": "NamedItem$ebnf$1", "symbols": ["NamedItem$ebnf$1", /[a-z-]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "NamedItem", "symbols": ["NamedItem$ebnf$1"], "postprocess": d => d[0].join('')},
    {"name": "Uuid$ebnf$1", "symbols": [/[a-f0-9-]/]},
    {"name": "Uuid$ebnf$1", "symbols": ["Uuid$ebnf$1", /[a-f0-9-]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Uuid", "symbols": ["Uuid$ebnf$1"], "postprocess": d => d[0].join('')}
];
let ParserStart = "FullPath";
export default { Lexer, ParserRules, ParserStart };
`
    });

    // NOOP
    await output.build();

    expect(output.changes()).to.deep.equal({});
  });
});
