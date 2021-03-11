import p5 from "p5";
import GraphNode from "./node";
import Spring from "./spring";

new p5((p: p5) => {
  let bob: GraphNode;
  let anchor: GraphNode;
  let spring: Spring;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    bob = new GraphNode(p, p.width / 2, p.height / 2);
    anchor = new GraphNode(p, p.width / 2, 10);
    spring = new Spring(0.02, 200, bob, anchor);
  };

  p.draw = () => {
    p.background(0);
    spring.update();
    bob.update();
    // anchor.update();
    spring.show(p);
    bob.show(p);
    anchor.show(p);
  }
});