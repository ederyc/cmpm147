// sketch.js - purpose and description here
// Author: Eder Yepez Cuevas
// Date: April 15th, 2025

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
    }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

/* exported setup, draw */
let seed = 0;
const skyColors = ["#3dfc7d", "#6efcb7", "#81ffbf"];
const mountainColor = "#1a1a1a";
const waterColor = "#09373d";
const starColor = "#ffffff";

let stars = [];

function setup() {
  let canvas = createCanvas(800, 400);
  canvas.parent('canvas-container');
  // Link the existing HTML button to reimagine functionality
  const reimagineBtn = document.getElementById("reimagine");
  reimagineBtn.addEventListener("click", () => {
    seed++;
    randomSeed(seed);
    noiseSeed(seed);
    createStaticBackground();
  });

  // create static background
  createStaticBackground();

  // create stars with random positions and slight motion
  for (let i = 0; i < 100; i++) {
    stars.push({
      x: random(width),
      y: random(height / 2),
      speed: random(0.1, 0.5),
      size: random(1, 2)
    });
  }
}

function draw() {
  image(bg, 0, 0); // draw pre-rendered background

  drawMovingStars();
  drawMovingWater();
}

let bg;

function createStaticBackground() {
  // create a pre-rendered background to avoid redrawing mountains and aurora every frame
  bg = createGraphics(width, height);
  bg.background("#162840");
  drawAurora(bg);
  drawMountains(bg);
}




function drawAurora(pg) {
  pg.noStroke();
  for (let i = 0; i < 30; i++) {
    pg.fill(color(random(skyColors) + "10")); // translucent
    pg.beginShape();
    for (let x = 0; x <= width; x += 20) {
      const y = noise(x * 0.01, i * 0.1 + seed) * height / 2;
      pg.vertex(x, y);
    }
    pg.vertex(width, 0);
    pg.vertex(0, 0);
    pg.endShape(CLOSE);
  }
}

function drawMountains(pg) {
  pg.fill(mountainColor);
  pg.beginShape();
  pg.vertex(0, height / 2);
  for (let x = 0; x <= width; x += 20) {
    const y = height / 2 - noise(x * 0.01 + seed) * 200;
    pg.vertex(x, y);
  }
  pg.vertex(width, height / 2);
  pg.vertex(width, height);
  pg.vertex(0, height);
  pg.endShape(CLOSE);
}

function drawMovingWater() {
  noStroke();

  const waveCount = 8;

  for (let i = 0; i < waveCount; i++) {
    let waveOffset = i * 15; // vertical spacing between waves
    let waveSpeed = frameCount * 0.01 + i * 0.5;
    let waveHeight = 8 + i * 1.5;

    // color fade from aurora green to black
    let topColor = color("#1e4a3f");
    let bottomColor = color("#000000");
    let waveColor = lerpColor(topColor, bottomColor, i / (waveCount - 1));
    fill(waveColor);

    beginShape();
    vertex(0, height); // bottom left
    for (let x = 0; x <= width; x += 10) {
      let y = height / 2 + waveOffset + waveHeight * sin(x * 0.015 + waveSpeed);
      vertex(x, y);
    }
    vertex(width, height); // bottom right
    endShape(CLOSE);
  }
}






function drawMovingStars() {
  noStroke();
  fill(starColor);
  for (let s of stars) {
    ellipse(s.x, s.y, s.size);
    s.x += s.speed;
    if (s.x > width) {
      s.x = 0;
      s.y = random(height / 2);
    }
  }
}



// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}