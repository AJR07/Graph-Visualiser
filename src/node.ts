import p5 from "p5";
import { SpringObject } from "./spring";

export default class GraphNode implements SpringObject {
  id: number;

  pos: p5.Vector;
  vel: p5.Vector;
  acc: p5.Vector;

  static PERCEPTION_RADIUS = 1000;
  static MAX_SPEED = 10;
  static MAX_FORCE = 0.2;

  constructor(p: p5, id: number, x: number, y: number) {
    this.id = id;
    this.pos = p.createVector(x, y);
    this.vel = p.createVector();
    this.acc = p.createVector();
  }

  applyForce(force: p5.Vector): void {
    this.acc.add(force);
  }

  update() {
    this.vel.mult(0.9).add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  show(p: p5) {
    p.circle(this.pos.x, this.pos.y, 50);
  }
}
