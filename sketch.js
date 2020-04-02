let table;
let rowCount;
let display = 1;
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

var screenW, screenH;
function setup() {
  screenW = windowWidth;
  screenH = windowHeight;
  createCanvas(screenW, screenH);
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

    n[r] = new Node(id[r], journal[r], connected[r], classification[r], windowWidth / 2 - mindist/2 + random(mindist), windowHeight / 2 - mindist/2 + random(mindist));
    console.log(n[r].id, n[r].journal, n[r].connected, n[r].classification, n[r].pos); 
  }
}

function draw() {
  background(200);
  
  for (let r = 0; r < rowCount; r++) {
    for (let s = 0; s < rowCount; s++) {
      if (n[r].journal <= display && n[s].journal <= display && s != r) {

        // seperating
        if (p5.Vector.dist(n[r].pos, n[s].pos) < mindist) {
          n[r].speed = p5.Vector.sub(n[r].pos, n[s].pos).normalize();
          n[r].pos.add(n[r].speed.mult(mindist / dist(n[r].pos.x, n[r].pos.y, n[s].pos.x, n[s].pos.y) / 10));
        }


        for (let c = 0; c < n[r].connected.length; c++) {
          // when connected
          if (n[r].connected[c] == n[s].id) {
            //strokeWeight(25);
            //stroke(205);
            //line(n[r].pos.x, n[r].pos.y, n[s].pos.x, n[s].pos.y);

            // cluster when connected
            if (p5.Vector.dist(n[r].pos, n[s].pos) > mindist*0.5) {
              n[r].speed = p5.Vector.sub(n[r].pos, n[s].pos).normalize(); 
              n[r].pos.sub(n[r].speed.mult(dist(n[r].pos.x, n[r].pos.y, n[s].pos.x, n[s].pos.y) / mindist * random(1)));
              n[s].pos.sub(n[r].speed.mult(dist(n[r].pos.x, n[r].pos.y, n[s].pos.x, n[s].pos.y) / mindist * random(-1)));
            }
            if (n[n[s].id].journal <= display){
              n[r].intensity++;
            }
          }
        }
      }
    }
  }

  for (let r = 0; r < rowCount; r++) {
    //node display
    if (n[r].journal <= display) {(HSB, 255);
      fill(127+n[r].intensity*15, 149, 0);
      noStroke();
      ellipse(n[r].pos.x, n[r].pos.y, 10+n[r].intensity/2, 10+n[r].intensity/2);
      fill(255);
      textSize(15);
      textAlign(CENTER, CENTER);
      //text(n[r].id, n[r].pos.x, n[r].pos.y);
    }

    //info display
    if (n[r].journal == display) {
      fill(200);
     rect(0, screenH-30,  windowWidth, 50);
     fill(100);
      noStroke();
      textSize(20);
      textAlign(LEFT, TOP);
      text("date:"+date[r], 20, screenH-30);
       textAlign(RIGHT, TOP);
     text("confirmed:" + id[r], screenW-20, screenH-30);
    }
        n[r].intensity = 0;
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

class Node {
  constructor(i, j, c, cl, x, y) {
    this.id = i;
    this.journal = j;
    this.connected = c;
    this.classification = cl;
    this.pos = createVector(x, y);
    this.intensity = 0;
  }
}
