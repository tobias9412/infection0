let table;
let rowCount;
let display = 0;
let mindist = 75;

let firstPopUpY = 100;
let mobile, statusBarHeight;
let oriWindowWidth, oriWindowHeight;

let translatePos;

let n              = [];
let id             = [];
let journal        = [];
let date           = [];
let connection     = [];
let category       = [];
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

function setup() {
  translatePos = createVector(0,0);
  moveDelta = createVector(0,0);

  createCanvas(windowWidth, windowHeight);
  translate(windowWidth/2, windowHeight/2);

  if (windowWidth < 768) 
    mobile = true;
  else 
    mobile = false;

  if (mobile) 
    statusBarHeight = 170;
  else 
    statusBarHeight = 110;
  

  oriWindowWidth = windowWidth;
  oriWindowHeight = windowHeight;

  rowCount = table.getRowCount();

  for (let r = 0; r < rowCount; r++) {
    id[r] = r + 1;
    journal[r] = table.get(r, 'Journal');
    date[r] = table.get(r, 'Report date');

    connection[r] = table.get(r, 'Connection');
    connected[r] = [];
    connected[r] = int(split(connection[r], '/'));
    category[r] = table.get(r, 'Category');
    classification[r] = table.get(r, "Classification");

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

  n[r] = new Node(id[r], journal[r], connected[r], category[r], classification[r], endJournal[r], endStatus[r], windowWidth / 2 - mindist/2 + random(mindist), windowHeight / 2 - mindist/2 + random(mindist));
      console.log(n[r].id, n[r].journal, n[r].connected, n[r].category, n[r].classification, n[r].endJournal, n[r].endStatus); 
    }

  textStyle(BOLD);
  textSize(20);
}

function draw() {
  background(200);
  push();
  translate(translatePos);

  fill(210);
  ellipse(windowWidth/2, windowHeight/2, 1024, 1024);

    //reset intensity
  for (let r = 0; r < rowCount; r++) 
    n[r].intensity = 0;

  if (display > 0) {
      for (let r = 0; r < rowCount; r++) {
        for (let s = 0; s < rowCount; s++) {
          if (n[r].journal <= display && n[s].journal <= display && s > r) {

              //category
            if (n[r].category == n[s].category && n[r].category != "") {
              if (n[r].intensity < 15)
                n[r].intensity ++;

            if (n[r].intensity < 10)
             n[r].pos.lerp(n[s].pos, 0.005);
            else 
              n[r].pos.lerp(n[s].pos, 0.001);
            }

            for (let c = 0; c < n[r].connected.length; c++) {
              // when connected
              if (n[r].connected[c] == n[s].id) {
                  n[r].pos.lerp(n[s].pos, 0.1);
                  n[s].pos.lerp(n[r].pos, 0.1);
              } 
            }


            // seperating
              if (n[s].intensity < 10) {
                if (p5.Vector.dist(n[r].pos, n[s].pos) < mindist) {
                n[r].speed = p5.Vector.sub(n[r].pos, n[s].pos).normalize();
                n[r].pos.add(n[r].speed.mult(mindist / dist(n[r].pos.x, n[r].pos.y, n[s].pos.x, n[s].pos.y)/10));
                n[s].pos.add(n[r].speed.mult(mindist / dist(n[r].pos.x, n[r].pos.y, n[s].pos.x, n[s].pos.y)/-10));
              }
            }
          }
        }


      let cen = createVector(windowWidth/2, windowHeight/2);
      if (n[r].journal <= display){
        if (p5.Vector.dist(n[r].pos, cen) > 256)
          n[r].pos.lerp(cen, 0.002);
        if (p5.Vector.dist(n[r].pos, cen) > 500)
          n[r].pos.lerp(cen, 0.005);
      }
    }

    //node display // hospitalised
    for (let r = 0; r < rowCount; r++) {
      if (n[r].journal <= display) {
        if (n[r].endJournal > display) {
          fill(127+n[r].intensity*30, 149, 0);
          noStroke();
          ellipse(n[r].pos.x, n[r].pos.y, 15+n[r].intensity^2, 15+n[r].intensity^2);
        }
      }
    } 

    for (let r = 0; r < rowCount; r++) { 
      if (n[r].journal <= display && n[r].endJournal <= display) {
        if(n[r].endStatus == 0) {
          fill(127+n[r].intensity*30, 149, 0);
          noStroke();
          ellipse(n[r].pos.x, n[r].pos.y, 15+n[r].intensity^2, 15+n[r].intensity^2);
        }
        else if (n[r].endStatus == 1) {
          stroke(127+n[r].intensity*30, 149, 0);
          fill(210);
          ellipse(n[r].pos.x, n[r].pos.y, 15+n[r].intensity^2, 15+n[r].intensity^2);
        } 
        else if (n[r].endStatus == 2) {
          noStroke();
          fill(20);
          ellipse(n[r].pos.x, n[r].pos.y, 15+n[r].intensity^2, 15+n[r].intensity^2);
        } 
      }       
    }
  }

  pop();
  fill(50, alpha);
  for (let r = 0; r < rowCount; r++) {
    if (n[r].journal <= display) {
        if (mouseX-translatePos.x > n[r].pos.x-10 && mouseX-translatePos.x < n[r].pos.x+10 &&
            mouseY-translatePos.y > n[r].pos.y-10 && mouseY-translatePos.y < n[r].pos.y+10) {
            text(n[r].category, mouseX, mouseY-20);
        }
      }
    }


  if (display == 0) {
    firstPopUpY = lerp(firstPopUpY, 0, 0.3);

    // welcomePopUp
    rectMode(CENTER)
    fill(230);
    rect(windowWidth/2, windowHeight/2+firstPopUpY, 360, 600, 15);
    fill(50);
    textAlign(CENTER, CENTER);
    text("拖放或滑動以瀏覽畫面\n\n\n圖例\n\n\n\n\n\n\n\n\n關連的個案會以聚集圓點顯示，\n個案傳染影響越大，\n顏色越偏橙色，圓點越大。\n\n\n", windowWidth/2, windowHeight/2+firstPopUpY);
    textAlign(LEFT, CENTER);
    text("已出院個案\n\n死亡個案\n\n確診或疑似個案\n\n\n", windowWidth/2, windowHeight/2+firstPopUpY);
    fill(0, 0);
    stroke(150);
    ellipse(windowWidth*0.45, windowHeight/2-90+firstPopUpY, 15, 15);
    fill(0);
    noStroke();
    ellipse(windowWidth*0.45, windowHeight/2-40+firstPopUpY, 15, 15);
    fill(150);
    noStroke();
    ellipse(windowWidth*0.45, windowHeight/2+10+firstPopUpY, 15, 15);

    fill(100);
    rect(windowWidth/2, windowHeight/2+240+firstPopUpY, 300, 60, 10);
    fill(230);
    textAlign(CENTER, CENTER);
    text("繼續", windowWidth/2, windowHeight/2+240+firstPopUpY);
  }

  else {
    firstPopUpY = lerp(firstPopUpY, windowHeight/2+300, 0.3);
  
  if (mobile) { 
    rectMode(CORNER);
    fill (130);
    rect(10, windowHeight-55, windowWidth-20, 50, 10);
    fill(230);
    textAlign(CENTER, CENTER);
    text("下一日", windowWidth/2, windowHeight-30);
  }
  else {
    rectMode(CORNER);
    fill (130);
    rect(300, windowHeight-statusBarHeight+20, windowWidth-320, statusBarHeight-30, 10);
    fill(230);
    textAlign(CENTER, CENTER);
    text("下一日", 300+(windowWidth-320)/2, windowHeight-45);
  }

    //info display
    fill(50);
    noStroke();
    textSize(20);
    textAlign(LEFT, TOP);
    if (display < 10)
      text("截至2020年1月" + (display+22) + "日" , 10, windowHeight-statusBarHeight+10);
    if (display >= 10 && display < 39)
      text("截至2020年2月" + (display-9) + "日"  , 10, windowHeight-statusBarHeight+10);
    if (display >= 39 && display < 70)
      text("截至2020年3月" + (display-38) + "日" , 10, windowHeight-statusBarHeight+10);
    if (display >= 70)
      text("截至2020年4月" + (display-69) + "日" , 10, windowHeight-statusBarHeight+10);

    textAlign(LEFT, TOP);
    text("已出院個案：　　 " + strDischarged + "宗\n死亡個案：　　　 " + strDeceased + "宗\n確診或疑似個案： " + strConfirmed　+ "宗", 10, windowHeight-statusBarHeight+35);
  }
  console.log(frameRate());
}

let deltaX, deltaY;

function touchStarted() {
  deltaX = mouseX;
  deltaY = mouseY;
}

function touchMoved() {
  deltaX = mouseX - deltaX;
  deltaY = mouseY - deltaY;
  translatePos.x += deltaX;
  translatePos.y += deltaY;
  deltaX = mouseX;
  deltaY = mouseY;
}

function touchEnded() {
  if (display == 0) {
    if (mouseX > windowWidth/2-150 && mouseX < windowWidth/2+150 &&
        mouseY > windowHeight/2+210 && mouseY < windowHeight/2+270)
      display = 1;
          strConfirmed = 2;

  } else {
    if ((mobile && mouseY > windowHeight-60) || 
        (!mobile && mouseY > windowHeight-statusBarHeight && mouseX > 300)){
      
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
    }
  }

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  translatePos.x += (windowWidth-oriWindowWidth)/2;
  translatePos.y += (windowHeight-oriWindowHeight)/2;
  oriWindowWidth = windowWidth;
  oriWindowHeight = windowHeight;

  if (windowWidth < 768) mobile = true;
  else mobile = false;

  if (mobile) statusBarHeight = 170;
  else statusBarHeight = 110;

}

class Node {
  constructor(i, j, c, ca, cl, ej, es, x, y) {
    this.id = i;
    this.journal = j;
    this.connected = c;
    this.category = ca;
    this.classification = cl;
    this.endJournal = ej;
    this.endStatus = es;
    this.pos = createVector(x, y);
    this.intensity = 0;
  }
}