// Infinite Running Track
let trackSketch = function(p) {
    let seed;
    p.setup = function() {
      p.createCanvas(400, 200);
      seed = p.random(1000);
    };
  
    p.draw = function() {
      p.background(200, 255, 200);
      p.fill(160, 40, 40);
      for (let y = 140; y < 180; y += 10) {
        p.rect(0, y, p.width, 5);
      }
      p.fill(0);
      p.textAlign(p.CENTER);
      p.text("Track Generator", p.width / 2, 20);
    };
  };
  new p5(trackSketch, 'track-container');
  
  
  // Infinite Soccer Field
  let soccerSketch = function(p) {
    p.setup = function() {
      p.createCanvas(400, 200);
    };
  
    p.draw = function() {
      p.background(100, 160, 100);
      p.stroke(255);
      p.strokeWeight(2);
      p.line(p.width / 2, 0, p.width / 2, p.height);
      p.noFill();
      p.ellipse(p.width / 2, p.height / 2, 80, 80);
      p.noStroke();
      p.fill(0);
      p.textAlign(p.CENTER);
      p.text("Soccer Field Generator", p.width / 2, 20);
    };
  };
  new p5(soccerSketch, 'soccer-container');
  
  
  let racecarSketch = function(p) {
    let worldSeed = 12345;
    let tw = 64;
    let th = 48;
    let cameraX = 0;
  
    const ROAD_START = 5;
    const ROAD_END = 8;
    let carLane = ROAD_END - 1;
    let lastLaneChange = 0;
    const laneCooldown = 100;
  
    let car = {
      x: 200,
    };
  
    p.setup = function() {
      p.createCanvas(800, 300);
      worldSeed = XXH.h32("race", 0);
      p.noiseSeed(worldSeed);
      p.randomSeed(worldSeed);
    };
  
    p.draw = function() {
      if (p.keyIsDown(p.RIGHT_ARROW)) {
        cameraX += p.keyIsDown(p.SHIFT) ? 10 : 5;
      }
  
      p.background(80, 180, 80);
  
      let cols = Math.ceil(p.width / tw) + 2;
      let rows = Math.ceil(p.height / th);
      let offsetX = Math.floor(cameraX / tw);
  
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let i = x + offsetX;
          let j = y;
  
          let screenX = x * tw - (cameraX % tw);
          let screenY = y * th;
  
          p.push();
          p.translate(screenX, screenY);
          drawTile(i, j);
          p.pop();
        }
      }
  
      drawCar();
    };
  
    function drawTile(i, j) {
      p.push();
  
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
      } else if (j >= ROAD_START && j <= ROAD_END) {
        p.fill(40);
        p.rect(0, 0, tw, th);
  
        p.stroke(180);
        p.strokeWeight(2);
        if (j !== ROAD_END) {
          for (let x = 0; x < tw; x += 10) {
            p.line(x, th - 3, x + 5, th - 3);
          }
        }
  
        if (i % 2 === 0) p.stroke(255, 0, 0);
        else p.stroke(255);
        p.strokeWeight(3);
        p.line(0, 0, 0, th);
        p.line(tw, 0, tw, th);
        p.noStroke();
  
        let hash = XXH.h32(`obstacle:${i},${j}`, worldSeed);
        if (hash % 15 === 0) {
          p.fill(255, 165, 0);
          p.triangle(tw / 2, 10, tw / 2 - 6, th - 10, tw / 2 + 6, th - 10);
        }
      } else {
        p.fill(90, 200, 90);
        p.rect(0, 0, tw, th);
      }
  
      p.pop();
    }
  
    function drawCar() {
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
  
      if (carHash % 15 === 0) {
        p.push();
        p.translate(car.x, carLane * th + 5);
        p.fill(255, 0, 0);
        p.textAlign(p.CENTER);
        p.text("💥", 0, 0);
        p.pop();
        return;
      }
  
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
  };
  
  new p5(racecarSketch, 'racecar-container');
  