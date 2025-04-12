// project.js - purpose and description here
// Author: Your Name
// Date:

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }
  
  // define a method
  myMethod() {
    // code to run when method is called
  }
}

function main() {
  const fillers = {
    learner: ["Music Student", "Budding Musician", "Future Maestro", "Seeker of Songs"],
    pre: ["Canta", "Melod", "Rhyth","Harmo"],
    post: ["cadence", "sonata", "phonia"],
    people: ["lovely", "melodic", "aspiring", "youthful"],
    num: ["two", "three", "eleven", "so many", "too many", "an unsatisfying number of", "barely any", "an unspecified amount of", "surely a satisfactory number of"],
    message: ["advice", "tutorial", "walkthrough", "guide"],
    chords: ["C major", "C major 7", "C minor", "C minor 7","C7", "C# major", "C# major 7", "C# minor", "C#7","D major", "D major 7", "D minor", "D minor 7","D7", "D# major", "D# major 7", "D# minor", "D#7",
            "A major", "A major 7", "A minor", "A minor 7","A7", "A# major", "A# major 7", "A# minor", "A#7",
            "B major", "B major 7", "B minor", "B minor 7","B7",
            "E major", "E major 7", "E minor", "E minor 7","E7",
            "F major", "F major 7", "F minor", "F minor 7","F7", "F# major", "F# major 7", "F# minor", "F#7",
            "G major", "G major 7", "G minor", "G minor 7","G7", "G# major", "G# major 7", "G# minor", "G#7",]
    
  };
  
  const template = `$learner, here is my $message on how to make a great song!
  
  We here at the $pre$post school of music, make it our purpose to teach $people people like yourself the most beautiful of chord progressions. 
  
  Here is your chords progression: $chords $chords $chords $chords repeat this $num times and then switch to $chords $chords $chords for your chorus,
  
  then $chords $chords $chords $chords can be your bridge!
  `;
  
  
  // STUDENTS: You don't need to edit code below this line.
  
  const slotPattern = /\$(\w+)/;
  
  function replacer(match, name) {
    let options = fillers[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }
  
  function generate() {
    let story = template;
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, replacer);
    }
  
    /* global box */
    $("#box").text(story);;
  }
  
  /* global clicker */
  $("#clicker").click(generate);
  
  generate();
  
}

// let's get this party started - uncomment me
main();