import debounce from "lodash.debounce";
import p5 from "p5";
import Vue from "vue";
import Queue from "../queue";
import "../style.css";
import clamp from "./clamp";
import Edge, { DEFAULT_EDGE_DISPLAY_OPTIONS, EdgeDisplayOptions } from "./edge";
import Graph, {
  DEFAULT_GRAPH,
  DEFAULT_GRAPH_OPTIONS,
  GraphOptions,
} from "./graph";
import GraphNode from "./node";

const EPSILON = 0.0001;

// Internal representation of graph will always be adjacency list
let graph = Graph.parseGraph(DEFAULT_GRAPH, DEFAULT_GRAPH_OPTIONS);
console.log(graph.adjlist);

// The stuff to be drawn
// Nodes are graph nodes and are just circles
// Its stored in a Map (similar to c++ map)
// Where the key is the idx of the node
let nodes: Map<number, GraphNode> = new Map();
// Springs control the spring forces between the nodes
let springs: Edge[] = [];

// Queue of stuff for the update() method to handle
const queue: Queue<(p: p5) => void> = new Queue();

let currentlyDraggedNode: GraphNode | null = null;

// The actual p5 instance that draws stuff
new p5((p: p5) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);

    // Create nodes based on graph representation
    updateNodes(p);

    // Create springs (dfs)
    // The idea is that when you dfs you visit every edge once
    // So you create a spring connecting the 2 nodes
    // Right now it doesn't deal with one-directional edges
    // Imma deal with that later
    updateSprings(p);
  };

  p.draw = () => {
    p.background(0);

    // HANDLE EVENTS
    let task = queue.pop();
    while (task) {
      task(p);
      task = queue.pop();
    }

    // REPULSION OF NODES
    // For every node...
    for (const [, node] of nodes) {
      const steering = p.createVector();
      let total = 0;
      // You visit every other node
      for (const [, other] of nodes) {
        let d = p.dist(node.pos.x, node.pos.y, other.pos.x, other.pos.y);
        // If the other node is not your own
        // And if the other node is within your perception radius
        if (d <= 0) d = EPSILON;
        if (other != this && d < GraphNode.PERCEPTION_RADIUS) {
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
        p5.Vector.sub(p.createVector(p.width / 2, p.height / 2), node.pos)
          // Set its speed (like above)
          .setMag(GraphNode.MAX_SPEED)
          // Subtract to get the steering (like above)
          .sub(node.vel)
          // Limit the force (like above)
          .limit(GraphNode.MAX_FORCE * 0.7)
      );
    }

    // Add some random force to keep things interesting
    /*
    for (const [, node] of nodes) {
      const force = p.createVector();
      const dir = p.noise(node.pos.x, node.pos.y);
      force.setMag(100);
      force.rotate(p.map(dir, 0, 1, 0, p.TWO_PI));
      node.vel.add(force);
    }
    */

    // Force the nodes to be inside the screen
    // Basically we just clamp the position inside the screen lol
    for (const [, node] of nodes) {
      node.pos.set(
        clamp(node.pos.x, GraphNode.SIZE, p.width - GraphNode.SIZE),
        clamp(node.pos.y, GraphNode.SIZE, p.height - GraphNode.SIZE)
      );
    }

    // Update and draw all springs
    for (const spring of springs) {
      spring.update();
      spring.show(p);
    }

    // Update and draw all nodes
    for (const [, node] of nodes) {
      if (node != currentlyDraggedNode) node.update();
      node.show(p);
    }

    // Draggable nodes
    currentlyDraggedNode?.pos.set(p.mouseX, p.mouseY);
    currentlyDraggedNode?.vel.set(0, 0);
    currentlyDraggedNode?.acc.set(0, 0);
  };

  p.mouseDragged = () => {
    for (const [, node] of nodes) {
      if (
        p.dist(p.mouseX, p.mouseY, node.pos.x, node.pos.y) <
        GraphNode.SIZE / 2
      ) {
        currentlyDraggedNode = node;
        return;
      }
    }
  };

  p.mouseReleased = () => {
    currentlyDraggedNode = null;
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});

interface VueData {
  graphText: string;
  graphOptions: GraphOptions;
  edgeDisplayOptions: EdgeDisplayOptions;
  hidden: boolean,
  debouncedUpdateGraph: () => void;
}

// eslint-disable-next-line @typescript-eslint/ban-types
new Vue<VueData, { updateGraph(): void, hideShow():void}, object, never>({
  el: "#vue-app",
  data() {
    return {
      graphText: DEFAULT_GRAPH,
      graphOptions: DEFAULT_GRAPH_OPTIONS,
      edgeDisplayOptions: DEFAULT_EDGE_DISPLAY_OPTIONS,
      hidden: false,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      debouncedUpdateGraph: () => { },
    };
  },
  watch: {
    edgeDisplayOptions: {
      handler: function (
        newValue: EdgeDisplayOptions,
        prevValue: EdgeDisplayOptions
      ) {
        console.log("edgeDisplayOptions changed");
        Edge.displayOptions = this.edgeDisplayOptions;
        if (
          newValue.length != prevValue.length ||
          newValue.thickness != newValue.thickness
        ) {
          this.debouncedUpdateGraph();
        } else {
          this.updateGraph();
        }
      },
      deep: true,
    },
  },
  created() {
    this.debouncedUpdateGraph = debounce(this.updateGraph, 500);
  },
  methods: {
    hideShow: function() {
      this.hidden = !this.hidden
    },
    updateGraph() {
      console.log("Updating graph");
      queue.push((p: p5) => {
        graph = Graph.parseGraph(this.graphText, this.graphOptions);
        updateNodes(p);
        updateSprings(p);
        //update Rest Length
        if (!this.edgeDisplayOptions.showLength)
          for (const spring of springs) {
            spring.restLength = this.edgeDisplayOptions.length;
          }
        else {
          for (const spring of springs) {
            spring.restLength =
              (spring.weight * this.edgeDisplayOptions.length) / 2; //allows the default length bar to still kinda affect it by multiplying it
          }
        }
      });
    },
  },
});

function updateNodes(p: p5) {
  nodes = new Map();

  for (const [key] of graph.adjlist) {
    nodes.set(
      key,
      new GraphNode(p, key, p.random(p.width), p.random(p.height))
    );
  }
}

function updateSprings(p: p5) {
  springs = [];

  let maxWeight = -Infinity;
  let minWeight = Infinity;

  for (const edge of Graph.adjlistToEdgelist(graph.adjlist)) {
    if (edge[2] > maxWeight) maxWeight = edge[2];
    if (edge[2] < minWeight) minWeight = edge[2];
  }

  for (const edge of Graph.adjlistToEdgelist(graph.adjlist)) {
    springs.push(
      new Edge(
        p,
        0.01,
        edge[2],
        minWeight,
        maxWeight,
        nodes.get(edge[0])!,
        nodes.get(edge[1])!,
        graph.options.bidirectional,
        graph.options.weighted
      )
    );
  }
}