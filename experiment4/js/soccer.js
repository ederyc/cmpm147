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

let ball = {
  x: 300,
  lane: 5,
  vx: 0 
};


let tw = 64;
let th = 64;
let playerLane = 5;
let lastLaneChange = 0;
const laneCooldown = 100;

function p3_preload() {}

function p3_setup() {}

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return tw;
}

function p3_tileHeight() {
  return th;
}

function p3_tileClicked(i, j) {
  clicks[[i, j]] = millis();
}

function p3_drawBefore() {
  background(80, 180, 80); // green fallback
}

function p3_drawTile(i, j) {
  push();

  // Sky rows (j <= 3)
  if (j <= 3) {
    fill(135, 206, 235); // blue sky
    rect(0, 0, tw, th);

    let skyHash = XXH.h32(`sky:${i},${j}`, worldSeed);
    if (skyHash % 10 === 0) {
      fill(255, 255, 255, 220);
      ellipse(tw / 2, th / 3, 30, 16);
      ellipse(tw / 2 - 10, th / 3 + 5, 24, 12);
      ellipse(tw / 2 + 10, th / 3 + 5, 24, 12);
    }

  // Field grass and markings
  } else {
    fill(100 + noise(i * 0.1, j * 0.1, worldSeed) * 30, 180, 100);
    rect(0, 0, tw, th);

    stroke(255);
    strokeWeight(2);

    if (i % 10 === 0) {
      line(tw / 2, 0, tw / 2, th);
    }

    if (j === 6) {
      line(0, th / 2, tw, th / 2);
    }

    // Center circle
    if (i === 10 && j === 6) {
      noFill();
      ellipse(tw / 2, th / 2, 40, 40);
    }

    // Cone obstacle if clicked
    if (clicks[[i, j]]) {
      fill(255, 165, 0);
      triangle(tw / 2, 10, tw / 2 - 6, th - 10, tw / 2 + 6, th - 10);
    }
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
  // Controls: allow lane change within field range
  if (millis() - lastLaneChange > laneCooldown) {
    if (keyIsDown(UP_ARROW) && playerLane > 4) {
      playerLane--;
      lastLaneChange = millis();
    }
    if (keyIsDown(DOWN_ARROW) && playerLane < 7) {
      playerLane++;
      lastLaneChange = millis();
    }
  }

  let i = Math.floor((cameraX + 200) / tw);
  let j = playerLane;

  if (clicks[[i, j]]) {
    push();
    translate(200, playerLane * th - 10);
    fill(255, 0, 0);
    textAlign(CENTER);
    text("💥", 0, 0);
    pop();
    return;
  }

  // Runner sprite
  push();
  let x = 200;
  let y = playerLane * th;

  let bounce = sin(millis() * 0.01) * 2;
  translate(x, y + bounce);

  fill(255, 80, 80);
  ellipse(0, 0, 14, 14); // head
  rect(-4, 7, 8, 14);    // torso
  line(-4, 21, -8 + sin(millis() * 0.1) * 4, 28); // legs
  line(4, 21, 8 + sin(millis() * 0.1 + PI) * 4, 28);

  pop();
  
    // Ball movement
  ball.x += ball.vx;
  ball.vx *= 0.95; // friction to slow it down

  // Check for collision with player
  let playerX = cameraX + 200;
  if (playerLane === ball.lane && abs(ball.x - playerX) < 14) {
    ball.vx = 10; // kick the ball forward
  }

  // Draw ball
  push();
  fill(255);
  stroke(0);
  ellipse(ball.x - cameraX, ball.lane * th + 12, 12, 12);
  pop();

}
