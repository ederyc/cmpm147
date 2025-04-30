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

let racecarSketch = function(p) {
  // Seeded world setup
  let worldSeed;
  let tw = 64;
  let th = 48;

  const ROAD_START = 5;
  const ROAD_END = 8;

  let carLane = ROAD_END - 1;
  let lastLaneChange = 0;
  const laneCooldown = 100;

  let car = {
    x: 200,
  };

  // p5 preload hook
  p.preload = function() {}

  // p5 setup hook
  p.setup = function() {
    p.createCanvas(800, 400);
  };

  // Movement logic, redraws everything
  p.draw = function() {
    if (p.keyIsDown(p.RIGHT_ARROW)) {
      if (p.keyIsDown(p.SHIFT)) {
        cameraX += 10;
      } else {
        cameraX += 5;
      }
    }

    p.background(180);
    p_drawBefore();

    let cols = Math.ceil(p.width / tw) + 2;
    let rows = Math.ceil(p.height / th);
    let offsetX = Math.floor(cameraX / tw);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let worldX = x + offsetX;
        let screenX = x * tw - (cameraX % tw);
        let screenY = y * th;

        p.push();
        p.translate(screenX, screenY);
        p_drawTile(worldX, y, screenX, screenY);
        p.pop();
      }
    }

    p_drawAfter();
  };

  // Draw green field background
  function p_drawBefore() {
    p.background(80, 180, 80);
  }

  // Draw tiles by row
  function p_drawTile(i, j) {
    p.push();

    // Sky
    if (j <= 3) {
      p.fill(135, 206, 235);
      p.rect(0, 0, tw, th);
      let skyHash = XXH.h32(`sky:${i},${j}`, worldSeed);
      if (skyHash % 10 === 0) {
        p.fill(255);
        p.ellipse(tw / 2, th / 3, 30, 16);
        p.ellipse(tw / 2 - 10, th / 3 + 5, 24, 12);
        p.ellipse(tw / 2 + 10, th / 3 + 5, 24, 12);
      }

    // Road
    } else if (j >= ROAD_START && j <= ROAD_END) {
      p.fill(40);
      p.rect(0, 0, tw, th);

      // Horizontal lane dividers
      p.stroke(180);
      p.strokeWeight(2);
      if (j !== ROAD_END) {
        for (let x = 0; x < tw; x += 10) {
          p.line(x, th - 3, x + 5, th - 3);
        }
      }

      // Edge curbs
      if (i % 2 === 0) p.stroke(255, 0, 0);
      else p.stroke(255);
      p.strokeWeight(3);
      p.line(0, 0, 0, th);
      p.line(tw, 0, tw, th);
      p.noStroke();

      // Obstacle
      let hash = XXH.h32(`obstacle:${i},${j}`, worldSeed);
      if (hash % 15 === 0) {
        p.fill(255, 165, 0);
        p.triangle(tw / 2, 10, tw / 2 - 6, th - 10, tw / 2 + 6, th - 10);
      }

    // Grass
    } else {
      p.fill(90, 200, 90);
      p.rect(0, 0, tw, th);
    }

    p.pop();
  }

  // Draws the car and handles collisions
  function p_drawAfter() {
    // Car lane movement
    if (p.millis() - lastLaneChange > laneCooldown) {
      if (p.keyIsDown(p.UP_ARROW) && carLane > ROAD_START) {
        carLane--;
        lastLaneChange = p.millis();
      }
      if (p.keyIsDown(p.DOWN_ARROW) && carLane < ROAD_END) {
        carLane++;
        lastLaneChange = p.millis();
      }
    }

    let carI = Math.floor((cameraX + car.x) / tw);
    let carJ = carLane;
    let carHash = XXH.h32(`obstacle:${carI},${carJ}`, worldSeed);

    // Obstacle collision
    if (carHash % 15 === 0) {
      p.push();
      p.translate(car.x, carLane * th + 5);
      p.fill(255, 0, 0);
      p.textAlign(p.CENTER);
      p.text("\u{1F4A5}", 0, 0);
      p.pop();
      return;
    }

    // Draw car
    p.push();
    p.translate(car.x, carLane * th + 5);
    let bounce = p.sin(p.millis() * 0.02) * 1.5;

    p.fill(255, 0, 0);
    p.rect(-12, bounce, 24, 12, 3);

    p.fill(20);
    p.rect(-14, bounce + 10, 6, 4);
    p.rect(8, bounce + 10, 6, 4);
    p.pop();
  }

  // World seed update
  p.p3_worldKeyChanged = function(key) {
    worldSeed = XXH.h32(key, 0);
    p.noiseSeed(worldSeed);
    p.randomSeed(worldSeed);
  };

  // Required function exports for engine
  p.p3_preload = p.preload;
  p.p3_setup = p.setup;
  p.p3_tileWidth = () => tw;
  p.p3_tileHeight = () => th;
  p.p3_tileClicked = () => {};
  p.p3_drawBefore = p_drawBefore;
  p.p3_drawTile = p_drawTile;
  p.p3_drawAfter = p_drawAfter;
  p.p3_drawSelectedTile = function(i, j) {
    p.noFill();
    p.stroke(0, 255, 0);
    p.rect(0, 0, tw, th);
    p.fill(0);
    p.noStroke();
    p.text(`tile ${i},${j}`, 5, 12);
  };
};

new p5(racecarSketch, 'racecar-canvas');
