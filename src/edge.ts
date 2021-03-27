import p5 from "p5";
import GraphNode from "./node";

export interface EdgeDisplayOptions {
  length: number;
  showThickness: boolean;
  thickness: number;
  showLength: boolean;
}

export const DEFAULT_EDGE_DISPLAY_OPTIONS: EdgeDisplayOptions = {
  length: 200,
  showThickness: true,
  thickness: 3,
  showLength: false,
};

export default class Edge {
  k: number;
  restLength: number;
  a: GraphNode;
  b: GraphNode;

  constructor(k: number, a: GraphNode, b: GraphNode) {
    this.k = k;

    this.restLength = 200;

    this.a = a;
    this.b = b;
  }

  update(): void {
    const force = p5.Vector.sub(this.b.pos, this.a.pos);
    const displacement = force.mag() - this.restLength;
    force.normalize().mult(this.k * displacement);
    this.a.applyForce(force);
    this.b.applyForce(p5.Vector.mult(force, -1));
  }
}
