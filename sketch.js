let positionX, positionY, pressedBefore = false;

function setup() {
    createCanvas(400, 400);
    frameRate(1);
}
xq
function draw() {
    background("grey");
    if (mouseIsPressed) {
        if (pressedBefore != true) {
            positionX = mouseX;
            positionY = mouseY;
            pressedBefore = true;
            console.log(mouseY);
        } else {
            pressedBefore = true;
            line(mouseX, mouseY, positionX, positionY);
        }
    }
}

function AddNode() {
    console.log("Yay")
}
