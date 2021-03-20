import p5 from "p5";
import GraphNode from "./node";

export interface SpringObject {
  applyForce(force: p5.Vector): void;
  pos: p5.Vector;
}

export default class Edge {
  k: number;
  restLength: number;
  a: SpringObject;
  b: SpringObject;

  weight: number;
  maxWeight: number;
  minWeight: number;

  bidirectional: boolean;
  weighted: boolean;

  static MIN_LENGTH = 50;
  static MAX_LENGTH = 300;
  static MIN_WEIGHT = 1;
  static MAX_WEIGHT = 10;
  static showWeightbyStroke = false;
  static constantThickness = 10;

  constructor(
    p: p5,
    k: number,
    weight: number,
    minWeight: number,
    maxWeight: number,
    a: SpringObject,
    b: SpringObject,
    bidirectional: boolean,
    weighted: boolean
  ) {
    this.k = k;

    // Higher weight == longer length
    this.restLength = 200;
    // this.restLength = p.map(
    //   weight,
    //   minWeight,
    //   maxWeight,
    //   Edge.MIN_LENGTH,
    //   Edge.MAX_LENGTH
    // );
    this.minWeight = minWeight;
    this.maxWeight = maxWeight;
    this.weight = weight;

    this.a = a;
    this.b = b;

    this.bidirectional = bidirectional;
    this.weighted = weighted;
  }

  update(): void {
    const force = p5.Vector.sub(this.b.pos, this.a.pos);
    const displacement = force.mag() - this.restLength;
    force.normalize().mult(this.k * displacement);
    this.a.applyForce(force);
    this.b.applyForce(p5.Vector.mult(force, -1));
  }

  show(p: p5): void {
    const strokeWeight = p.map(
      this.weight,
      this.minWeight,
      this.maxWeight,
      Edge.MIN_WEIGHT,
      Edge.MAX_WEIGHT
    );

    // Line
    if (this.bidirectional) {
      if (Edge.showWeightbyStroke) p.strokeWeight(strokeWeight);
      else p.strokeWeight(Edge.constantThickness);
      p.stroke(255);
      p.line(this.a.pos.x, this.a.pos.y, this.b.pos.x, this.b.pos.y);
    }

    // Weight indicator
    const left = this.a.pos.x < this.b.pos.x ? this.a : this.b;
    const right = this.a.pos.x < this.b.pos.x ? this.b : this.a;

    const v = p5.Vector.sub(right.pos, left.pos);
    v.div(2);

    p.noStroke();
    p.fill(255);

    p.push();
    p.translate(left.pos);
    p.rotate(v.heading());
    p.text(`${this.weight}`, v.mag(), 15 + strokeWeight / 2);
    p.pop();

    // Arrow
    if (!this.bidirectional) {
      const aToB = p5.Vector.sub(this.b.pos, this.a.pos);
      const arrowSize = 25;
      const lineLength = aToB.mag() - arrowSize - GraphNode.SIZE / 2;

      p.push();
      p.translate(this.a.pos);
      p.strokeWeight(strokeWeight);
      p.stroke(255);
      p.rotate(aToB.heading());
      p.line(0, 0, lineLength, 0);
      p.noStroke();
      p.translate(lineLength, 0);
      p.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
      p.pop();
    }
  }
}
