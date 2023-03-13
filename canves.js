let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidhtElem = document.querySelector(".pencil-width");
let erserWidthElem = document.querySelector(".erasser-width");
let mouseDown = false;
// API

let penColor = "red";
let erraserColor = "white";
let penWidht = pencilWidhtElem.value;
let erraserWidth = erserWidthElem.value;

let undo = document.querySelector(".undo");
let redo = document.querySelector(".redo");

let undoRedoTracker = []; // data
let track = 0; // represent what action do with tracker array
let tool = canvas.getContext("2d");
tool.strokeStyle = penColor;
tool.lineWidth = penWidht;

// mouseDown -> start new path
// mousemove -> fill path

canvas.addEventListener("mousedown", (e) => {
  mouseDown = true;
  let trackObj = {
    x: e.clientX,
    y: e.clientY,
  };
  beginPath(trackObj);
});

canvas.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    drawStroke({
      x: e.clientX,
      y: e.clientY,
      color: eraserFlag ? erraserColor : penColor,
      width: eraserFlag ? erraserWidth : penWidht,
    });
  }
});

canvas.addEventListener("mouseup", (e) => {
  mouseDown = false;
  let url = canvas.toDataURL();
  undoRedoTracker.push(url);
  track = undoRedoTracker.length - 1;
});

function beginPath(strokeObj) {
  tool.beginPath();
  tool.moveTo(strokeObj.x, strokeObj.y);
}

function drawStroke(strokeObj) {
  tool.lineTo(strokeObj.x, strokeObj.y);
  tool.stroke();
  tool.strokeStyle = strokeObj.color;
  tool.lineWidth = strokeObj.width;
}
// tool.beginPath(); // new path/new graphic
// tool.moveTo(10, 10); // start point
// tool.lineTo(100, 150); // end point
// tool.stroke(); // fill color/ fill graphic

// tool.lineTo(300, 500);
// tool.stroke();

pencilColor.forEach((colorElem) => {
  colorElem.addEventListener("click", (e) => {
    penColor = colorElem.classList[0];
    console.log(penColor);
    tool.strokeStyle = penColor;
  });
});

pencilWidhtElem.addEventListener("change", (e) => {
  penWidht = pencilWidhtElem.value;
  tool.lineWidth = penWidht;
});

erserWidthElem.addEventListener("change", (e) => {
  erraserWidth = erserWidthElem.value;
  tool.lineWidth = erraserWidth;
});

eraser.addEventListener("click", (e) => {
  if (eraserFlag) {
    tool.strokeStyle = erraserColor;
    tool.lineWidth = erraserWidth;
  } else {
    tool.strokeStyle = penColor;
    tool.lineWidth = penWidht;
  }
});

download.addEventListener("click", (e) => {
  let url = canvas.toDataURL();
  let a = document.createElement("a");
  a.href = url;
  a.download = "board.jpg";
  a.click();
});

undo.addEventListener("click", (e) => {
  if (track > 0) track--;
  console.log(track);
  let trackObj = {
    trackValue: track,
    undoRedoTracker,
  };

  console.log(trackObj.trackValue);
  // socket.emit("redoUndo", data);

  undoRedoCanves(trackObj);
});

redo.addEventListener("click", (e) => {
  if (track < undoRedoTracker.length - 1) track++;

  let trackObj = {
    trackValue: track,
    undoRedoTracker,
  };
  // socket.emit("redoUndo", data);

  undoRedoCanves(trackObj);
});

function undoRedoCanves(trackObj) {
  console.log("ur called for " + trackObj.trackValue);
  track = trackObj.trackValue;
  undoRedoTracker = trackObj.undoRedoTracker;
  let url = undoRedoTracker[track];
  console.log(url);
  let img = new Image(); // new image ref elem
  img.src = url;
  img.onload = (e) => {
    console.log("drawing image to canves");
    tool.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
}

// socket.on("beginPath", (data) => {
//   // data -> data from server
//   beginPath(data);
// });

// socket.on("drawStroke", (data) => {
//   // data -> data from server
//   drawStroke(data);
// });

// socket.on("redoUndo", (data) => {
//   // data -> data from server
//   undoRedoCanves(data);
// });
