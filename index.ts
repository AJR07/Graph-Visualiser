import p5 from "p5";

let y = 250, restLength = 200, k = 0.01, velocity = 0;

new p5((p: p5) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = () => {
    p.background(0)
    p.fill("blue");
    p.circle(p.width / 2, y, p.width / 8);

    let displacement = y - restLength;
    let force = -k * displacement;

    velocity += force;
    y += velocity;

    velocity *= 0.99;
  }
});