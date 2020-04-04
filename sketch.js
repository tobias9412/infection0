let table;
let rowCount;
let display = 0;
let mindist = 75;

let n              = [];
let id             = [];
let journal        = [];
let date           = [];
let connection     = [];
let classification = [];
let connected      = [];
let endJournal     = [];
let endStatus      = [];

let strConfirmed  = 0;
let strDischarged = 0;
let strDeceased   = 0;


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

    endJournal[r] = table.get(r, 'End journal');
    switch (table.get(r, 'End status')) {
      case "Discharged":
        endStatus[r] = 1;
        break;
      case "Deceased":
        endStatus[r] = 2;
        break;
      default:
        endStatus[r] = 0;
        break;
      }

n[r] = new Node(id[r], journal[r], connected[r], classification[r], endJournal[r], endStatus[r], windowWidth / 2 - mindist/2 + random(mindist), windowHeight / 2 - mindist/2 + random(mindist));
    console.log(n[r].id, n[r].journal, n[r].connected, n[r].classification, n[r].endJournal, n[r].endStatus); 
  }

  textStyle(BOLD);
  textSize(20);

}

function draw() {
  background(200);

  if (display == 0) {
    fill(180);
    rect(0, 0, windowWidth, windowHeight);
    fill(50);
    textAlign(CENTER, CENTER);
    text("按滑鼠左鍵或碰觸螢幕前進下一日\n\n\n圖例\n\n\n\n\n\n\n\n\n\n關連的個案會為以聚集一起顯示，\n個案傳染影響越大，\n顏色越偏橙色，形狀越大。", windowWidth/2, windowHeight/2);
    textAlign(LEFT, CENTER);
    text("已出院個案\n\n死亡個案\n\n確診或疑似個案", windowWidth/2, windowHeight/2);
    fill(0, 0);
    stroke(230);
    ellipse(windowWidth*0.45, windowHeight/2-50, 15, 15);
    fill(0);
    noStroke();
    ellipse(windowWidth*0.45, windowHeight/2, 15, 15);
    fill(230);
    noStroke();
    ellipse(windowWidth*0.45, windowHeight/2+50, 15, 15);
  } else {


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
              if (n[n[s].id-1].journal <= display){
                n[r].intensity++;
              }
            }
          }
        }
      }
    }

    for (let r = 0; r < rowCount; r++) {
      //node display
      if (n[r].journal <= display) {
        // hospitalised
        if (n[r].endJournal > display || n[r].endStatus == 0) {
        fill(127+n[r].intensity*30, 149, 0);
        noStroke();
        ellipse(n[r].pos.x, n[r].pos.y, 10+n[r].intensity*log(5), 10+n[r].intensity*log(5));
      } else { 
      if (n[r].endJournal <= display && n[r].endStatus == 1) {
        stroke(127+n[r].intensity*30, 149, 0);
        fill(200);
        ellipse(n[r].pos.x, n[r].pos.y, 10+n[r].intensity*log(5), 10+n[r].intensity*log(5));
      }
        if (n[r].endJournal <= display && n[r].endStatus == 2) {
        noStroke();
        fill(20);
        ellipse(n[r].pos.x, n[r].pos.y, 10+n[r].intensity*log(5), 10+n[r].intensity*log(5));
       }
      }

    }
  }
    //info display

    fill(50);
    noStroke();
    textSize(20);
    textAlign(LEFT, BOTTOM);
    if (display < 10)
      text("直至2020年1月" + (display+22) + "日" , 10, screenH-88);
    if (display >= 10 && display < 39)
      text("直至2020年2月" + (display-9) + "日" , 10, screenH-88);
    if (display >= 39 && display < 70)
      text("直至2020年3月" + (display-38) + "日" , 10, screenH-88);
    if (display >= 70)
      text("直至2020年4月" + (display-69) + "日" , 10, screenH-88);

    textAlign(LEFT, BOTTOM);
    text("已出院個案：　　 " + strDischarged + "宗\n死亡個案：　　　 " + strDeceased + "宗\n確診或疑似個案： " + strConfirmed　+ "宗", 10, screenH-10);


     for (let r = 0; r < rowCount; r++) 
         n[r].intensity = 0;
    
  }
}


/*function mouseClicked() {
  if (display < n[rowCount-1].journal)
    display += 1;
}*/

function touchEnded() {
  strDischarged = 0;
  strDeceased = 0;

  if (display < n[rowCount-1].journal)
    display += 1;

  for (let r = 0; r < rowCount; r++) {

    if (n[r].journal <= display)
      strConfirmed = id[r];

    if (n[r].endJournal <= display && n[r].endStatus == 1)
      strDischarged ++;
        if (n[r].endJournal <= display && n[r].endStatus == 2) 
      strDeceased   ++;
  }
}

class Node {
  constructor(i, j, c, cl, ej, es, x, y) {
    this.id = i;
    this.journal = j;
    this.connected = c;
    this.classification = cl;
    this.endJournal = ej;
    this.endStatus = es;
    this.pos = createVector(x, y);
    this.intensity = 0;
  }
}
