import p5 from "p5";
import { SpringObject } from "./spring";

export default class GraphNode implements SpringObject {
  pos: p5.Vector;
  vel: p5.Vector;
  acc: p5.Vector;

  constructor(p: p5, x: number, y: number) {
    this.pos = p.createVector(x, y);
    this.vel = p.createVector();
    this.acc = p.createVector();
  }

  applyForce(force: p5.Vector): void {
    this.acc.add(force);
  }

  update() {
    this.vel.mult(0.99).add(this.acc)
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  show(p: p5) {
    p.circle(this.pos.x, this.pos.y, 20);
  }
}