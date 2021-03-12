import p5 from 'p5';

export interface SpringObject {
  applyForce(force: p5.Vector): void;
  pos: p5.Vector;
}

export default class Spring {
  k: number;
  restLength: number;
  a: SpringObject;
  b: SpringObject;

  constructor(k: number, restLength: number, a: SpringObject, b: SpringObject) {
    this.k = k;
    this.restLength = restLength;
    this.a = a;
    this.b = b;
  }

  update() {
    const force = p5.Vector.sub(this.b.pos, this.a.pos);
    const displacement = force.mag() - this.restLength;
    force
      .normalize()
      .mult(this.k * displacement);
    this.a.applyForce(force);
    this.b.applyForce(p5.Vector.mult(force, -1));
  }

  show(p: p5) {
    p
      .strokeWeight(3)
      .stroke(255)
      .line(this.a.pos.x, this.a.pos.y, this.b.pos.x, this.b.pos.y);
  }
}