import p5 from "p5";

new p5((p: p5) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(0);
  };

  p.draw = () => {
    p.ellipse(p.mouseX, p.mouseY, 20);
  }
});