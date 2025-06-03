let boxes = [];
let hasCollision = false;
let iterations = 0;
const glyphs = "THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG";

class Box {
  constructor(t, x, y, w, h) {
    this.t = t;
    this.pos = createVector(x, y);
    this.size = createVector(w, h);
    this.offset = createVector(0, 0);
    this.dragging = false;
  }

  display() {
    stroke(50);
    strokeWeight(3);
    fill(this.dragging ? "#ffaaaa" : "#aaffaa");
    rect(this.pos.x, this.pos.y, this.size.x, this.size.y, 10);
    text(this.t, this.pos.x + 5, this.pos.y + 15);
  }

  update() {
    if (this.dragging) {
      this.pos.x = mouseX + this.offset.x;
      this.pos.y = mouseY + this.offset.y;
    }
  }

  mousePressed() {
    if (
      mouseX > this.pos.x &&
      mouseX < this.pos.x + this.size.x &&
      mouseY > this.pos.y &&
      mouseY < this.pos.y + this.size.y
    ) {
      this.dragging = true;
      this.offset.x = this.pos.x - mouseX;
      this.offset.y = this.pos.y - mouseY;
    }
  }

  mouseReleased() {
    this.dragging = false;
  }

  resolveCollision(other) {
    if (this === other) return;

    let dx = this.pos.x - other.pos.x;
    let dy = this.pos.y - other.pos.y;

    let collision =
      this.pos.x - this.size.x / 2 < other.pos.x + other.size.x / 2 &&
      this.pos.x + this.size.x / 2 > other.pos.x - other.size.x / 2 &&
      this.pos.y - this.size.y / 2 < other.pos.y + other.size.y / 2 &&
      this.pos.y + this.size.y / 2 > other.pos.y - other.size.y / 2;

    if (collision) {
      hasCollision = true;
      iterations++;
      // Resolve the collision on the axis with less overlap
      if (abs(dx) > abs(dy)) {
        dx > 0 ? this.pos.x++ : this.pos.x--;
      } else {
        dy > 0 ? this.pos.y++ : this.pos.y--;
      }
      other.resolveCollision(this);
    }
  }
}

function setup() {
  createCanvas(800, 600);
  for (let i = 0; i < glyphs.length; i++) {
    boxes.push(
      new Box(
        glyphs[i],
        width / 2 + (random(10) - 5),
        height / 2 + (random(10) - 5),
        80,
        80
      )
    );
  }
}

function draw() {
  background(240);

  // Update and display all boxes
  for (let b of boxes) {
    b.update();
    b.display();
  }
  hasCollision = false;
  iterations = 0;
  // Collision resolution
  for (let i = 0; i < boxes.length; i++) {
    for (let j = 0; j < boxes.length; j++) {
      if (i !== j) {
        boxes[i].resolveCollision(boxes[j]);
      }
    }
  }
  if (hasCollision) {
    text(`collision ${iterations}`, 10, 10);
  }
}

function mousePressed() {
  for (let b of boxes) {
    b.mousePressed();
  }
}

function mouseReleased() {
  for (let b of boxes) {
    b.mouseReleased();
  }
}
