let table;
let rowCount;
let display = 10;
let mindist = 75;

let n = [];
let id = [];
let journal = [];
let date = [];
let connection = [];
let classification = [];
let connected = [];

function preload() {
  table = loadTable('https://raw.githubusercontent.com/tobias9412/infection0/master/data.csv',  'csv', 'header');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  rowCount = table.getRowCount();

  for (let r = 0; r < rowCount; r++) {
    id[r] = r + 1;
    journal[r] = table.get(r, 'Journal');
    date[r] = table.get(r, 'Report date');
    connection[r] = table.get(r, 'Connection');
    connected[r] = [];
    connected[r] = int(split(connection[r], '/'));

    switch (table.get(r, "Classification")) {
      case "Imported":
        classification[r] = 0;
        break;
      case "Close contact of imported case":
        classification[r] = 1;
        break;
      case "Possibly local":
        classification[r] = 2;
        break;
      case "Close contact of possibly local":
        classification[r] = 3;
        break;
      case "Local case":
        classification[r] = 4;
        break;
      case "Close contact of local case":
        classification[r] = 5;
        break;
    }

    n[r] = new Node(id[r], journal[r], connected[r], classification[r], windowWidth / 2 - mindist + random(mindist * 2), windowHeight / 2 - mindist + random(mindist * 2));
    console.log(n[r].id, n[r].journal, n[r].connected, n[r].classification, n[r].pos); 
  }
}

function draw() {
  for (let r = 0; r < rowCount; r++) {
    if (n[r].journal == display) {
      fill(200);
     rect(0, 0,  windowWidth, windowHeight);
     fill(150);
      noStroke();
      textSize(windowWidth / 10);
      text(date[r], windowWidth / 2, windowHeight / 4);
      text(id[r], windowWidth / 2, windowHeight / 4*3);
    }
  }

  for (let r = 0; r < rowCount; r++) {
    for (let s = 0; s < rowCount; s++) {
      if (n[r].journal <= display && n[s].journal <= display && s != r) {

        if (p5.Vector.dist(n[r].pos, n[s].pos) < mindist) {
          n[r].speed = p5.Vector.sub(n[r].pos, n[s].pos).normalize();
          n[r].pos.add(n[r].speed.mult(mindist / dist(n[r].pos.x, n[r].pos.y, n[s].pos.x, n[s].pos.y) / 5));
        }

        for (let c = 0; c < n[r].connected.length; c++) {
          if (n[r].connected[c] == n[s].id) {
            stroke(0);
            line(n[r].pos.x, n[r].pos.y, n[s].pos.x, n[s].pos.y);
          }

          if (n[r].connected[c] == n[s].id) {
            stroke(0);
            line(n[r].pos.x, n[r].pos.y, n[s].pos.x, n[s].pos.y);
            n[r].speed = p5.Vector.sub(n[r].pos, n[s].pos).normalize();

            if (p5.Vector.dist(n[r].pos, n[s].pos) > mindist) {
              n[r].pos.sub(n[r].speed.mult(sq(dist(n[r].pos.x, n[r].pos.y, n[s].pos.x, n[s].pos.y) / mindist) * random(1)));
              n[s].pos.sub(n[r].speed.mult(sq(dist(n[r].pos.x, n[r].pos.y, n[s].pos.x, n[s].pos.y) / mindist) * random(-1)));
            }
          }
        }
      }
    }
  }

  for (let r = 0; r < rowCount; r++) {
    if (n[r].journal <= display) {
      fill(0, 100);
      noStroke();
      ellipse(n[r].pos.x, n[r].pos.y, 25, 25);
      fill(255);
      textSize(15);
      textAlign(CENTER, CENTER);
      text(n[r].id, n[r].pos.x, n[r].pos.y);
    }
  }
}

function mouseClicked() {
  if (display < n[rowCount-1].journal)
    display++;
}

function touchEnded() {
  if (display < n[rowCount-1].journal)
    display++;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Node {
  constructor(i, j, c, cl, x, y) {
    this.id = i;
    this.journal = j;
    this.connected = c;
    this.classification = cl;
    this.pos = createVector(x, y);
  }
}
