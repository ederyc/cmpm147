/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */

// Loading inspirations
function getInspirations() {
    return [
      {
        name: "Pet Sounds", 
        assetUrl: "https://cdn.glitch.global/d22e07ff-03e7-4474-aa13-fba26bb1f395/pet_sounds.avif?v=1747017394055",
        credit: "Pet Sounds Album Cover, George Jerman, 1966"
      },
      {
        name: "Baggio Penalty Miss", 
        assetUrl: "https://cdn.glitch.global/d22e07ff-03e7-4474-aa13-fba26bb1f395/baggio.jpg?v=1747019089329",
        credit: "Baggio Penalty Miss, Omar Torres, 1994"
      },
      {
        name: "Glen Campbell", 
        assetUrl: "https://cdn.glitch.global/d22e07ff-03e7-4474-aa13-fba26bb1f395/glen.jpg?v=1747019809636",
        credit: "Glen Campbell, NBC, 1973"
      },
      {
        name: "Disaster Girl", 
        assetUrl: "https://cdn.glitch.global/3abd0223-86fb-43ce-a00a-fde12615bcd5/girl-with-fire.jpg?v=1714778905663",
        credit: "Four-year-old Zoë Roth, 2005"
      },
    ];
  }
  
  // Helper function to choose a weighted shape type
  function weightedRandomShape() {
    let shapes = ["rect", "triangle", "ellipse", "circle"];
    let weights = [0.4, 0.4, 0.1, 0.1]; // Bias towards rect and triangle (40% each), and 10% for ellipse and circle
    let totalWeight = weights.reduce((a, b) => a + b, 0);
    let randomValue = random(totalWeight);
    
    let sum = 0;
    for (let i = 0; i < shapes.length; i++) {
      sum += weights[i];
      if (randomValue < sum) {
        return shapes[i];
      }
    }
  }
  
  // Initialize the design based on the inspiration
  function initDesign(inspiration) {
    resizeCanvas(inspiration.image.width / 8, inspiration.image.height / 8);
    
    // Initialize a design with a background color and random foreground elements
    let design = {
      bg: random(255), // Random background color
      fg: []
    };
    
    let numShapes = 150;
    
    // Create 150 random shapes (rectangles, circles, ellipses, and triangles)
    for (let i = 0; i < numShapes; i++) {
      let shapeType = weightedRandomShape(); // Use the weighted random shape selection
      design.fg.push({
        x: random(width),
        y: random(height),
        w: random(width / 2),
        h: random(height / 2),
        fill: random(255), // Random color for the fill
        type: shapeType  // Store shape type
      });
    }
    
    return design;
  }
  
  // Render the design onto the canvas
  function renderDesign(design, inspiration) {
    background(design.bg); // Set background color
    noStroke(); // Remove stroke for shapes
    
    // Draw all the foreground shapes based on their type
    for (let box of design.fg) {
      fill(box.fill, 128); // Set fill with alpha transparency
      
      switch (box.type) {
        case "rect":
          rect(box.x, box.y, box.w, box.h); // Draw rectangle
          break;
        case "ellipse":
          ellipse(box.x, box.y, box.w, box.h); // Draw ellipse
          break;
        case "circle":
          ellipse(box.x, box.y, box.w, box.w); // Draw circle (circle is just a special ellipse)
          break;
        case "triangle":
          // Randomize triangle points for variety
          let x1 = box.x;
          let y1 = box.y;
          let x2 = box.x + box.w;
          let y2 = box.y + box.h;
          let x3 = box.x + box.w / 2;
          let y3 = box.y - box.h;
          triangle(x1, y1, x2, y2, x3, y3); // Draw triangle
          break;
      }
    }
  }
  
  // Mutate the design based on the mutation rate
  function mutateDesign(design, inspiration, rate) {
    // Mutate the background color and foreground shapes based on the rate
    design.bg = mut(design.bg, 0, 255, rate);
    
    for (let box of design.fg) {
      box.fill = mut(box.fill, 0, 255, rate);
      box.x = mut(box.x, 0, width, rate);
      box.y = mut(box.y, 0, height, rate);
      box.w = mut(box.w, 0, width / 2, rate);
      box.h = mut(box.h, 0, height / 2, rate);
      
      // Randomly mutate shape type too, to introduce variety in the design
      if (random(1) < 0.1) {  // 10% chance to change the shape type
        box.type = weightedRandomShape();  // Apply weighted randomness
      }
    }
  }
  
  // Helper function to apply mutation to parameters
  function mut(num, min, max, rate) {
    return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
  }
  