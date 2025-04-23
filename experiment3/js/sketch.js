/* exported generateGrid, drawGrid */
/* global placeTile, tileConfig */

function generateGrid(numCols, numRows) {
  let grid = [];

  if (tileConfig.floorBaseTj === 14) {
    // Dungeon mode: fill with walls
    for (let i = 0; i < numRows; i++) {
      let row = [];
      for (let j = 0; j < numCols; j++) {
        row.push("_");
      }
      grid.push(row);
    }

    // Carve rooms
    for (let n = 0; n < 3; n++) {
      let x1 = floor(random(1, numCols - 2));
      let x2 = floor(random(1, numCols - 2));
      let y1 = floor(random(1, numRows - 2));
      let y2 = floor(random(1, numRows - 2));

      for (let i = min(y1, y2); i <= max(y1, y2); i++) {
        for (let j = min(x1, x2); j <= max(x1, x2); j++) {
          grid[i][j] = ".";
        }
      }
    }
  } else {
    // Overworld mode
    for (let i = 0; i < numRows; i++) {
      let row = [];
      for (let j = 0; j < numCols; j++) {
        let n = noise(i / 10, j / 10);
        if (n > 0.6) {
          row.push("~");
        } else {
          row.push("_");
        }
      }
      grid.push(row);
    }

    for (let n = 0; n < 3; n++) {
      let x1 = floor(random(1, numCols - 2));
      let x2 = floor(random(1, numCols - 2));
      let y1 = floor(random(1, numRows - 2));
      let y2 = floor(random(1, numRows - 2));

      for (let i = min(y1, y2); i <= max(y1, y2); i++) {
        for (let j = min(x1, x2); j <= max(x1, x2); j++) {
          grid[i][j] = ".";
        }
      }
    }
  }

  return grid;
}

function drawGrid(grid) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let x = j * 16;
      let y = i * 16;
      let code = grid[i][j];

      if (code === ".") {
        drawContext(grid, i, j, ".", tileConfig.floorBaseTi, tileConfig.floorBaseTj);
      } else if (code === "~") {
        placeTile(i, j, tileConfig.waterTi, tileConfig.waterTj);
      } else if (code === "_") {
        placeTile(i, j, floor(random(4)), tileConfig.groundTileRow);

        if (tileConfig.floorBaseTj !== 14 && random() < 0.01) {
          let pulse = sin(millis() * 0.1 + i * j) * 50 + 180;
          noStroke();
          fill(255, 255, 160, pulse / 2);
          ellipse(j * 16 + 8, i * 16 + 8, 16, 16);
          fill(255, 255, 200, pulse);
          ellipse(j * 16 + 8, i * 16 + 8, 10, 10);
        }
      } else {
        placeTile(i, j, 0, 0);
      }

      let brightness = map(noise(i * 0.1, j * 0.1, millis() * 0.0001), 0, 1, 0, 150);
      noStroke();
      fill(0, 0, 0, brightness);
      rect(x, y, 16, 16);
    }
  }
}

function gridCheck(grid, i, j, target) {
  return i >= 0 && i < grid.length &&
         j >= 0 && j < grid[i].length &&
         grid[i][j] === target;
}

function gridCode(grid, i, j, target) {
  let north = gridCheck(grid, i - 1, j, target) ? 1 : 0;
  let south = gridCheck(grid, i + 1, j, target) ? 1 : 0;
  let east  = gridCheck(grid, i, j + 1, target) ? 1 : 0;
  let west  = gridCheck(grid, i, j - 1, target) ? 1 : 0;

  return (north << 0) + (south << 1) + (east << 2) + (west << 3);
}

function drawContext(grid, i, j, target, baseTi, baseTj) {
  const code = gridCode(grid, i, j, target);
  const [tiOffset, tjOffset] = lookup[code];
  placeTile(i, j, baseTi + tiOffset, baseTj + tjOffset);
}

const lookup = [
  [4, 0], [5, 0], [6, 0], [7, 0],
  [8, 0], [9, 0], [10, 0], [11, 0],
  [12, 0], [13, 0], [14, 0], [15, 0],
  [0, 1], [1, 1], [2, 1], [3, 1]
];
