"use strict";

/* global XXH */
/* exported
    p3_preload,
    p3_setup,
    p3_worldKeyChanged,
    p3_tileWidth,
    p3_tileHeight,
    p3_tileClicked,
    p3_drawBefore,
    p3_drawTile,
    p3_drawSelectedTile,
    p3_drawAfter
*/

let worldSeed;
let clicks = {};
let playerLane = 9;
let lastLaneChange = 0;
const laneCooldown = 100; // ms between moves
let runnerYOffset = playerLane * p3_tileHeight();

function p3_preload() {}

function p3_setup() {}

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 64;
}

function p3_tileHeight() {
  return 32;
}

let tw = p3_tileWidth();
let th = p3_tileHeight();

function getPlayerTile() {
  let i = Math.floor((cameraX + 200) / tw); // screen x + camera
  let j = playerLane;
  return [i, j];
}


function p3_tileClicked(i, j) {
  if(j >= 8 && j <= 11) {
    clicks[[i, j]] = millis();
  }
}

function p3_drawBefore() {
  background(150, 220, 150); // green field
}

function p3_drawTile(i, j) {
  push();
  noStroke();

  // Track tiles
  if (j >= 8 && j <= 11) {
    fill("#c22d2d");
    rect(0, 0, tw, th);

    stroke(255);
    strokeWeight(1);
    for (let k = 4; k < th; k += 5) {
      line(0, k, tw, k); // lane lines
    }
    
    // If tile was clicked, draw an obstacle
    if (clicks[[i, j]]) {
      fill(255, 120, 0); // orange cone
      triangle(tw / 2, 8, tw / 2 - 6, th - 6, tw / 2 + 6, th - 6);
    }


  // Crowd tiles
  } else if (j === 6 || j === 7) {
    // Draw stands
    fill(90);
    rect(0, 0, tw, th);
    
    // Bleacher steps
    stroke(60);
    strokeWeight(1);
    for (let l = 4; l < th; l += 6) {
      line(0, l, tw, l);
    }

    let hash = XXH.h32("crowd:" + i + "," + j, worldSeed);
    if (hash % 5 < 2) {
      let seat = hash % 5;
      let x = tw / 2;
      let y = seat * 6 + 5;

      let bounce = sin((millis() + hash) * 0.01) * 1.5;

      fill(hash % 255, 100, 200);
      ellipse(x, y + bounce, 10, 10); // head
      rect(x - 3, y + 5 + bounce, 6, 10); // body

      let lastClick = clicks[[i, j]];
      if (lastClick && millis() - lastClick < 1000) {
        fill(255, 255, 0, 200);
        star(x, y - 10, 4, 8, 5);
      }
    }

  // Sky
  } else if (j <= 5){
    fill(135, 206, 235);
    rect(0, 0, tw, th);
    // Clouds
    let hash = XXH.h32(`sky:${i},${j}`, worldSeed);
    if (hash % 12 === 0) {
      fill(255, 255, 255, 200);
      ellipse(tw / 2, th / 3, 20, 12); // base
      ellipse(tw / 2 - 8, th / 3 + 2, 16, 10);
      ellipse(tw / 2 + 8, th / 3 + 2, 16, 10);
    }
  } else {
    fill(150, 220, 150);
    rect(0, 0, tw, th);
  }

  pop();
}


function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0);
  rect(0, 0, tw, th);

  fill(0);
  noStroke();
  text(`tile ${i},${j}`, 5, 12);
}

function p3_drawAfter() {
  let [i, j] = getPlayerTile();
  
  // Lane control (Up/Down keys)
  if (millis() - lastLaneChange > laneCooldown) {
    if (keyIsDown(UP_ARROW) && playerLane > 8) {
      playerLane--;
      lastLaneChange = millis();
    }
    if (keyIsDown(DOWN_ARROW) && playerLane < 11) {
      playerLane++;
      lastLaneChange = millis();
    }
  }


  if (clicks[[i, j]]) {
    // Obstacle present: maybe draw crash or warning
    push();
    translate(200, playerLane * th - 10);
    fill(255, 0, 0);
    textAlign(CENTER);
    text("💥", 0, 0);
    pop();
    return; // skip drawing player
  }

  // Otherwise draw the player as usual
  push();
  let x = 200;
  let y = playerLane * th;

  let bounce = sin(millis() * 0.01) * 2;
  translate(x, y + bounce);

  fill(238, 206, 179);
  ellipse(0, 0, 14, 14); // head
  rect(-4, 7, 8, 14);    // torso
  line(-4, 21, -8 + sin(millis() * 0.1) * 4, 28); // legs
  line(4, 21, 8 + sin(millis() * 0.1 + PI) * 4, 28);

  pop();
}
