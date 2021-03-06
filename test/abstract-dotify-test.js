var common = require("./common"),
    assert = common.assert;

module.exports = function(name, Constructor, superName, SuperConstructor) {
  var g;

  beforeEach(function() {
    g = new Constructor();
  });

  describe("new " + name + "()", function() {
    it("has no nodes", function() {
      assert.equal(g.order(), 0);
      assert.lengthOf(g.nodes(), 0);
      assert.isObject(g.graph());
    });

    it("has no edges", function() {
      assert.equal(g.size(), 0);
      assert.lengthOf(g.edges(), 0);
    });
  });

  describe("graph", function() {
    it("only allows objects for value", function() {
      assert.throws(function() { g.graph("string"); });
    });
  });

  describe("addNode", function() {
    it("defaults to an empty object for value", function() {
      g.addNode(1);
      assert.deepEqual(g.node(1), {});
    });

    it("only allows objects for value", function() {
      g.addNode(1, {});
      assert.throws(function() { g.addNode(2, "string"); });
    });
  });

  describe("node", function() {
    it("only allows objects for value", function() {
      g.addNode(1);
      assert.throws(function() { g.node(1, "string"); });
    });
  });

  describe("addEdge", function() {
    it("defaults to an empty object for value", function() {
      g.addNode(1);
      g.addEdge("A", 1, 1);
      assert.deepEqual(g.edge("A"), {});
    });

    it("only allows objects for value", function() {
      g.addNode(1);
      g.addEdge("A", 1, 1, {});
      assert.throws(function() { g.addEdge("B", 1, 1, "string"); });
    });

    it("returns the id used for the edge", function() {
      g.addNode(1);
      assert.equal(g.addEdge("A", 1, 1, {}), "A");
      assert.isDefined(g.addEdge(null, 1, 1, {}));
    });
  });

  describe("edge", function() {
    it("only allows objects for value", function() {
      g.addNode(1);
      g.addEdge("A", 1, 1);
      assert.throws(function() { g.edge("A", "string"); });
    });
  });

  describe("copy", function() {
    it("copies basic nodes and edges", function() {
      g.addNode(1);
      g.addNode(2);
      g.addEdge("A", 1, 2);

      var copy = g.copy();

      assert.sameMembers(copy.nodes(), [1, 2]);
      assert.sameMembers(copy.edges(), ["A"]);
      assert.sameMembers(copy.incidentNodes("A"), [1, 2]);
    });

    it("shallow copies graph values", function() {
      g.graph().foo = "bar";
      var copy = g.copy();

      assert.equal(copy.graph().foo, "bar");
      copy.graph().foo = "baz";
      assert.equal(g.graph().foo, "baz");
    });

    it("shallow copies node values", function() {
      g.addNode(1, {foo: "bar"});
      var copy = g.copy();

      assert.equal(copy.node(1).foo, "bar");
      copy.node(1).foo = "baz";
      assert.equal(g.node(1).foo, "baz");
    });

    it("shallow copies edge values", function() {
      g.addNode(1);
      g.addNode(2);
      g.addEdge("A", 1, 2, { foo: "bar" });
      var copy = g.copy();

      assert.equal(copy.edge("A").foo, "bar");
      copy.edge("A").foo = "baz";
      assert.equal(g.edge("A").foo, "baz");
    });

    it("copies subgraphs", function() {
      g.addNode(1);
      g.addNode("sg1");
      g.parent(1, "sg1");
      var copy = g.copy();

      assert.sameMembers(copy.children("sg1"), [1]);
    });
  });

  describe("from" + superName, function() {
    var fromSuper = Constructor["from" + superName];

    it("returns a " + name, function() {
      var g = new SuperConstructor();
      assert.instanceOf(fromSuper(g), Constructor);
    });

    it("includes the graph value", function() {
      var g = new SuperConstructor();
      g.graph({a: "a-value"});
      assert.deepEqual(fromSuper(g).graph(), {a: "a-value"});
    });

    it("fails to convert a graph with a non-object value", function() {
      var g = new SuperConstructor();
      g.graph("foo");
      assert.throws(function() { fromSuper(g); });
    });

    it("includes nodes from the source graph", function() {
      var g = new SuperConstructor();
      g.addNode(1);
      g.addNode(2);
      assert.sameMembers(fromSuper(g).nodes(), [1, 2]);
    });

    it("includes node attributes from the source graph", function() {
      var g = new SuperConstructor();
      g.addNode(1, {a: "a-value"});
      assert.deepEqual(fromSuper(g).node(1), {a: "a-value"});
    });

    it("fails to convert a graph with non-object node values", function() {
      var g = new SuperConstructor();
      g.addNode(1, "foo");
      assert.throws(function() { fromSuper(g); });
    });

    it("includes edges from the source graph", function() {
      var g = new SuperConstructor();
      g.addNode(1);
      var edgeId = g.addEdge(null, 1, 1);
      assert.sameMembers(fromSuper(g).edges(), [edgeId]);
    });

    it("includes edge attributes from the source graph", function() {
      var g = new SuperConstructor();
      g.addNode(1);
      var edgeId = g.addEdge(null, 1, 1, {a: "a-value"});
      assert.deepEqual(fromSuper(g).edge(edgeId), {a: "a-value"});
    });

    it("has the same incidentNodes for edges from the source graph", function() {
      var g = new SuperConstructor();
      g.addNode(1);
      g.addNode(2);
      var edgeId = g.addEdge(null, 1, 2);
      assert.deepEqual(fromSuper(g).incidentNodes(edgeId), [1, 2]);
    });

    it("fails to convert a graph with non-object edge values", function() {
      var g = new SuperConstructor();
      g.addNode(1);
      g.addEdge(null, 1, 1, "foo");
      assert.throws(function() { fromSuper(g); });
    });
  });
};
