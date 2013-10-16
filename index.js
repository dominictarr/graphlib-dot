var parse = require("./lib/parse"),
    write = require("./lib/write"),
    version =

module.exports = {
  // DOT graphs
  DotGraph: require("./lib/DotGraph"),
  DotDigraph: require("./lib/DotDigraph"),

  // Parsing
  parse: parse,
  decode: parse,
  parseMany: parse.parseMany,

  // Writing
  write: write,
  encode: write,

  // For levelup encoding
  type: "dot",
  buffer: false
};
