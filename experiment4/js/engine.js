"use strict";

/* global p5 */
/* exported preload, setup, draw, mouseClicked */

// Simplified flat 2D scrolling engine

let tileWidth, tileHeight;
let cameraX;

function preload() {
  if (window.p3_preload) {
    window.p3_preload();
  }
}

function setup() {
  createCanvas(800, 400);
  cameraX = 0;

  if (window.p3_setup) {
    window.p3_setup();
  }

  let label = createP("World key: ");
  label.parent("container");

  let input = createInput("xyzzy");
  input.parent(label);
  input.input(() => {
    rebuildWorld(input.value());
  });

  createP("Right Arrow Key to run, Up and Down to change lanes. Clicking on the track adds obstacles.").parent("container");

  rebuildWorld(input.value());
}

function rebuildWorld(key) {
  if (window.p3_worldKeyChanged) {
    window.p3_worldKeyChanged(key);
  }
  tileWidth = window.p3_tileWidth ? window.p3_tileWidth() : 32;
  tileHeight = window.p3_tileHeight ? window.p3_tileHeight() : 32;
}

function draw() {
  if (keyIsDown(RIGHT_ARROW)) {
    if (keyIsDown(SHIFT)) {
      cameraX += 10; // boost speed
    } else {
      cameraX += 5;  // normal speed
    }
  }


  background(180);

  if (window.p3_drawBefore) {
    window.p3_drawBefore();
  }

  let cols = Math.ceil(width / tileWidth) + 2;
  let rows = Math.ceil(height / tileHeight);

  let offsetX = Math.floor(cameraX / tileWidth);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let worldX = x + offsetX;
      let screenX = x * tileWidth - (cameraX % tileWidth);
      let screenY = y * tileHeight;

      push();
      translate(screenX, screenY);
      if (window.p3_drawTile) {
        window.p3_drawTile(worldX, y, screenX, screenY);
      }
      pop();
    }
  }

  if (window.p3_drawAfter) {
    window.p3_drawAfter();
  }

  // Highlight selected tile
  let tileI = Math.floor((mouseX + cameraX) / tileWidth);
  let tileJ = Math.floor(mouseY / tileHeight);
  let tileX = tileI * tileWidth - cameraX % tileWidth;
  let tileY = tileJ * tileHeight;

  if (window.p3_drawSelectedTile) {
    push();
    translate(tileX, tileY);
    window.p3_drawSelectedTile(tileI, tileJ, tileX, tileY);
    pop();
  }
}

function mouseClicked() {
  let i = Math.floor((mouseX + cameraX) / tileWidth);
  let j = Math.floor(mouseY / tileHeight);

  if (window.p3_tileClicked) {
    window.p3_tileClicked(i, j);
  }

  return false;
}