let sounds = [];
let imgs = [];
let colors = [
  [37, 37, 37],
  [85, 85, 85],
  [123, 123, 123],
  [168, 168, 168],
  [192, 192, 192],
  [100, 100, 100],
];
let soundSequence = [];
let isSeqPlaying = false;
let seqIndex = 0;
let givenSeq = [];
let buttonPos = [];

//I use variable phase to change between start > game > end
let phase = "start";

function preload() {
  //load sounds
  sounds[0] = loadSound("sounds/beat.wav");
  sounds[1] = loadSound("sounds/marimba.wav");
  sounds[2] = loadSound("sounds/piano.wav");
  sounds[3] = loadSound("sounds/strings.wav");
  sounds[4] = loadSound("sounds/synth.wav");
  sounds[5] = loadSound("sounds/woodwind.wav");

  imgs[0] = loadImage("images/tex1.jpeg");
  imgs[1] = loadImage("images/tex2.jpeg");
  imgs[2] = loadImage("images/tex3.jpeg");
  imgs[3] = loadImage("images/tex4.jpeg");
  imgs[4] = loadImage("images/tex5.jpeg");
  imgs[5] = loadImage("images/tex6.jpeg");
}

function setup() {
  createCanvas(600, 400);
  rectMode(CENTER);

  //randomise colors and sounds array
  sounds = shuffle(sounds);
  colors = shuffle(colors);

  //sounds sequence is the desired random sequence
  soundSequence = shuffle([0, 1, 2, 3, 4, 5]); //there are 6 sounds

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      let x = map(i, 0, 2, 150, width - 150);
      let y = map(j, 0, 1, 150, height - 150);
      buttonPos.push({ x, y });
    }
  }
  buttonPos = shuffle(buttonPos);
}

function draw() {
  background(240);

  //draw record of previously pressed button
  drawPressedSounds();

  //place all the buttons on screen and assign them sounds
  for (let i = 0; i < buttonPos.length; i++) {
    soundButton(
      buttonPos[i].x,
      buttonPos[i].y,
      colors[i],
      sounds[soundSequence[i]],
      soundSequence[i]
    );
  }

  //play sequence sound
  playSqence(width / 2, height - 50, () => {});

  //draw squence bar
  squenceBar();
}

//function to draw markings behing sound buttons
function drawPressedSounds() {
  for (let i = 0; i < buttonPos.length; i++) {
    //if i is in given seq array?
    let isIn = false;
    for (let k = 0; k < givenSeq.length; k++) {
      if (givenSeq[k] == soundSequence[i]) isIn = true;
    }
    fill(145, 50);
    if (isIn) rect(buttonPos[i].x, buttonPos[i].y, 120, 70, 5);
  }

  for (let i = 0; i < givenSeq.length; i++) {
    if (givenSeq[i] != soundSequence[i]) {
      //reset the given sequence
      givenSeq = [];
    }
  }

  if (givenSeq.length == soundSequence.length) {
    //reset wehn all correct
    sounds = shuffle(sounds);
    colors = shuffle(colors);
    buttonPos = shuffle(buttonPos);
    givenSeq = [];
  }
}

function squenceBar() {
  stroke(144);
  strokeWeight(4);
  line(100, 60, width - 100, 60);
  stroke(70);
  circle(map(seqIndex - 1, -1, 5, 100, width - 100), 60, 15);
  strokeWeight(2);
  noStroke();
}

//a button function for normal Buttons
function playSqence(x, y, f) {
  fill(150);
  noStroke();
  if (abs(mouseX - x) < 75 && abs(mouseY - y) < 25) {
    stroke(255);
    if (mouseIsPressed && isSeqPlaying == false) {
      mouseIsPressed = false;
      isSeqPlaying = true;
    }
  }
  //logic to play sounds one after other
  if (isSeqPlaying) {
    if (seqIndex == 0) {
      sounds[soundSequence[seqIndex]].play();
      seqIndex += 1;
    } else {
      if (
        seqIndex >= 6 &&
        sounds[soundSequence[seqIndex - 1]].isPlaying() == false
      ) {
        seqIndex = 0;
        isSeqPlaying = false;
      }
      if (seqIndex != 0) {
        if (sounds[soundSequence[seqIndex - 1]].isPlaying() == false) {
          sounds[soundSequence[seqIndex]].play();
          seqIndex += 1;
        }
      }
    }
  }

  rect(x, y, 150, 50, 10);
  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(14);
  text("PLAY SEQUENCE", x, y);
}

//a button function for sound buttons
function soundButton(x, y, col, s, index) {
  fill(col[0] + 25, col[1] + 25, col[2] + 25);
  noStroke();

  let shift = 0;
  rect(x, y + shift, 100, 20 - shift);
  ellipse(x, y + 10, 100, 40);

  //check mouse over
  if (abs(mouseX - x) < 50 && abs(mouseY - y) < 20) {
    if (mouseIsPressed) shift = 5;
    stroke(col[0] + 50, col[1] + 50, col[2] + 50);
    if (mouseIsPressed) {
      mouseIsPressed = false; //tp make button only press once
      s.play();
      givenSeq.push(index); //record user's interation
      //I should stop sequence playing
      seqIndex = 0;
      isSeqPlaying = false;
    }
  }

  //cliping textured to button
  fill(col);
  push();
  imageMode(CENTER);
  beginClip();
  ellipse(x, y - 10 + shift, 100, 40);
  endClip();
  if (sounds[index].isPlaying()) {
    if (!isSeqPlaying) {
      image(
        imgs[index],
        x + random(-5, 5),
        y + random(-5, 5),
        imgs[index].width / 2,
        imgs[index].height / 2
      );
    } else {
      image(imgs[index], x, y, imgs[index].width / 2, imgs[index].height / 2);
    }
  } else {
    image(imgs[index], x, y, imgs[index].width / 2, imgs[index].height / 2);
  }
  pop();
}
