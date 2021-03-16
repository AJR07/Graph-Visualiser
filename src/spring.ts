import p5 from "p5";

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

  constructor(
    k: number,
    restLength: number,
    weight: number,
    a: SpringObject,
    b: SpringObject
  ) {
    this.k = k;
    this.restLength = restLength;
    this.weight = weight;
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

  show(p: p5): void {
    // Line
    p.strokeWeight(3)
      .stroke(255)
      .line(this.a.pos.x, this.a.pos.y, this.b.pos.x, this.b.pos.y);

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
    p.text(`${this.weight}`, v.mag(), 15);
    p.pop();
  }
}
