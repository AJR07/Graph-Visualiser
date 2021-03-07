import p5 from "p5";

let position = p5.createVector(0, 5), anchor = [1], restLength = 200, springConstant = 0.01, velocity = [1];

//sort out how to create those ^^ thingies as a p5 Vector type (ts doesn't allow or smth hm)
new p5((p: p5) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    position = [300, 200];
    anchor = [300, 0];
    velocity = [0, 0];
  };

  p.draw = () => {
    p.background(0)
    p.fill("blue");
    p.circle(anchor[0], position[1], 64)
    p.circle(position[0], anchor[1], 32);
    let force = p5.Vector.sub(p.createVector(position[0], position[1]), p.createVector(anchor[0], anchor[1]));
    let displacement = v.mag();
    force.normalize();
    force.mult(-1 * springConstant * displacement);

    let velocity1 = p.createVector(velocity[0], velocity[1]);
    velocity1.add(force);

    let position1 = p.createVector(position[0], position[1]);
    position1.add(velocity1);

    velocity1.mult(0.99);
  }
});