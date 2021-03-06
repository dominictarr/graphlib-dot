var CDigraph = require("graphlib").CDigraph,
    dotify = require("./dotify");

var DotDigraph = dotify(CDigraph);

module.exports = DotDigraph;

DotDigraph.fromDigraph = function(src) {
  var g = new DotDigraph(),
      graphValue = src.graph();

  if (graphValue !== undefined) {
    g.graph(graphValue);
  }

  src.eachNode(function(u, value) {
    if (value === undefined) {
      g.addNode(u);
    } else {
      g.addNode(u, value);
    }
  });
  src.eachEdge(function(e, u, v, value) {
    if (value === undefined) {
      g.addEdge(null, u, v);
    } else {
      g.addEdge(null, u, v, value);
    }
  });
  return g;
};
