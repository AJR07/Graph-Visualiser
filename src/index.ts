import p5 from "p5";
import clamp from "./clamp";
import Graph, { GraphOptions, GraphType } from "./graph";
import GraphNode from "./node";
import Spring from "./spring";

// These are the default graph that's shown when the user first comes on
const DEFAULT_GRAPH = `2 3
1 3
4 1`;
const DEFAULT_GRAPH_OPTIONS: GraphOptions = {
  type: GraphType.AdjList,
  bidirectional: true,
  weighted: false,
  startingIndex: 1,
};

// Internal representation of graph will always be adjacency list
let graph = Graph.parseGraph(DEFAULT_GRAPH, DEFAULT_GRAPH_OPTIONS);
console.log(graph.adjlist);

// The actual p5 instance that draws stuff
new p5((p: p5) => {
  // The stuff to be drawn
  // Nodes are graph nodes and are just circles
  // Its stored in a Map (similar to c++ map)
  // Where the key is the idx of the node 
  let nodes: Map<number, GraphNode> = new Map();
  // Springs control the spring forces between the nodes
  let springs: Spring[] = [];

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);

    // Create nodes based on graph representation
    for (const [key] of graph.adjlist) {
      nodes.set(key, new GraphNode(p, key, p.random(p.width), p.random(p.height)));
    }

    // Create springs (dfs)
    // The idea is that when you dfs you visit every edge once
    // So you create a spring connecting the 2 nodes
    // Right now it doesn't deal with one-directional edges
    // Imma deal with that later
    const visited = new Set<number>();
    function dfs(idx: number, previous: number | null) {
      visited.add(idx);

      if (previous) {
        springs.push(new Spring(0.01, 200, nodes.get(idx)!, nodes.get(previous)!));
      }

      for (const next of graph.adjlist.get(idx)!) {
        if (!visited.has(next.first)) {
          dfs(next.first, idx);
        }
      }
    }
    dfs(graph.options.startingIndex, null);
  };

  p.draw = () => {
    p.background(0);

    // REPULSION OF NODES
    // For every node...
    for (const [, node] of nodes) {
      let steering = p.createVector();
      let total = 0;
      // You visit every other node
      for (const [, other] of nodes) {
        const d = p.dist(node.pos.x, node.pos.y, other.pos.x, other.pos.y);
        // If the other node is not your own
        // And if the other node is within your perception radius
        if (other != this && d < GraphNode.PERCEPTION_RADIUS && d > 0) {
          // You add a force pointing from the other's position to the your position
          const diff = p5.Vector.sub(node.pos, other.pos);
          diff.div(d * d);
          steering.add(diff);
          total++;
        }
      }
      if (total > 0) {
        // We divide by the total to find the average 
        steering.div(total);
        // We set its magnitude to the max speed
        // So it always moves at that speed
        steering.setMag(GraphNode.MAX_SPEED);
        // Subtract the direction from the velocity
        // to get the steering
        steering.sub(node.vel);
        // We limit the force so it doesn't go too crazy
        steering.limit(GraphNode.MAX_FORCE);
      }
      // We actually apply that force
      node.applyForce(steering);
    }

    // Repulse from the walls (failed attempt at keeping stuff from drifting away)
    /*
    for (const [, node] of nodes) {
      let steering = p.createVector();
      const repulseWall = (x: number, y: number) => {
        const v = p5.Vector.sub(p.createVector(x, y), node.pos);
        if (v.mag() < 0) return;
        steering
          .setMag(GraphNode.MAX_SPEED)
          .sub(node.vel)
          .add(v)
          .div(v.mag() * v.mag());
      };

      repulseWall(0, node.pos.y); // left
      repulseWall(node.pos.x, 0); // top
      repulseWall(p.width, node.pos.y) // right
      repulseWall(node.pos.x, p.height); // bottom

      node.applyForce(steering);
    }
    */

    // Attracted to center
    for (const [, node] of nodes) {
      node.applyForce(
        // You get a vector pointing from your position to the center
        p5.Vector.sub(
          p.createVector(p.width / 2, p.height / 2),
          node.pos,
        )
          // Set its speed (like above)
          .setMag(GraphNode.MAX_SPEED)
          // Subtract to get the steering (like above)
          .sub(node.vel)
          // Limit the force (like above)
          .limit(GraphNode.MAX_FORCE / 2)
        ,
      );
    }

    // Force the nodes to be inside the screen
    // Basically we just clamp the position inside the screen lol
    for (const [, node] of nodes) {
      node.pos.set(
        clamp(node.pos.x, node.size, p.width - node.size),
        clamp(node.pos.y, node.size, p.height - node.size),
      );
    }


    // Update and draw all springs
    for (const spring of springs) {
      spring.update();
      spring.show(p);
    }

    // Update and draw all nodes
    for (const [, node] of nodes) {
      node.update();
      node.show(p);
    }
  };
});
