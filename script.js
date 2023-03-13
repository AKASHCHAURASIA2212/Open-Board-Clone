let optionCont = document.querySelector(".options-cont");
let optionFlag = true;
let toolsCont = document.querySelector(".tools-cont");
let pencilToolCont = document.querySelector(".pencil-tool-cont");
let eraserToolCont = document.querySelector(".erraser-tool-cont");
let pencilFlag = false;
let eraserFlag = false;

let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let sticky = document.querySelector(".sticky");
let upload = document.querySelector(".upload");
let download = document.querySelector(".download");
/*------------------------------------*/
optionCont.addEventListener("click", (e) => {
  optionFlag = !optionFlag;

  if (optionFlag) {
    openTools();
  } else {
    closeTools();
  }
});

function openTools() {
  let iconElem = optionCont.children[0];
  iconElem.classList.remove("fa-xmark");
  iconElem.classList.add("fa-bars");
  toolsCont.style.display = "flex";
}

function closeTools() {
  let iconElem = optionCont.children[0];
  iconElem.classList.remove("fa-bars");
  iconElem.classList.add("fa-xmark");
  toolsCont.style.display = "none";
  pencilToolCont.style.display = "none";
  eraserToolCont.style.display = "none";
}

pencil.addEventListener("click", (e) => {
  // true show pencil tool
  // false hide pencil tool
  pencilFlag = !pencilFlag;

  if (pencilFlag) {
    pencilToolCont.style.display = "block";
  } else {
    pencilToolCont.style.display = "none";
  }
});

eraser.addEventListener("click", (e) => {
  // true show eraser tool
  // false hide eraser tool
  eraserFlag = !eraserFlag;

  if (eraserFlag) {
    eraserToolCont.style.display = "flex";
  } else {
    eraserToolCont.style.display = "none";
  }
});

upload.addEventListener("click", (e) => {
  // open file explorer
  let input = document.createElement("input");
  input.setAttribute("type", "file");
  input.click();

  input.addEventListener("change", (e) => {
    let file = input.files[0];
    let url = URL.createObjectURL(file);

    let stickyTemplete = ` 
    <div class="header-cont">
       <div class="minimize"></div>
       <div class="remove"></div>
    </div>
    <div class="note-cont">
     <img src="${url}"/>
    </div>`;

    createSticky(stickyTemplete);
  });
});

function createSticky(templeteHtml) {
  let stickyCont = document.createElement("div");
  stickyCont.setAttribute("class", "sticky-cont");
  stickyCont.innerHTML = templeteHtml;
  document.body.appendChild(stickyCont);
  let minimize = stickyCont.querySelector(".minimize");
  let remove = stickyCont.querySelector(".remove");
  noteActions(minimize, remove, stickyCont);
  stickyCont.onmousedown = function (event) {
    dragAndMove(stickyCont, event);
  };
  stickyCont.ondragstart = function () {
    return false;
  };
}

sticky.addEventListener("click", (e) => {
  stickyTemplete = ` 
  <div class="header-cont">
     <div class="minimize"></div>
     <div class="remove"></div>
  </div>
  <div class="note-cont">
   <textarea spellcheck="false"></textarea>
  </div>`;
  createSticky(stickyTemplete);
});

function noteActions(minimize, remove, stickyCont) {
  remove.addEventListener("click", (e) => {
    stickyCont.remove();
  });

  minimize.addEventListener("click", (e) => {
    // console.log("minimise clicked");
    let noteCont = stickyCont.querySelector(".note-cont");
    let display = getComputedStyle(noteCont).getPropertyValue("display");

    if (display === "none") {
      noteCont.style.display = "block";
    } else {
      noteCont.style.display = "none";
    }
  });
}

function dragAndMove(element, event) {
  let shiftX = event.clientX - element.getBoundingClientRect().left;
  let shiftY = event.clientY - element.getBoundingClientRect().top;

  element.style.position = "absolute";
  element.style.zIndex = 1000;
  //   document.body.append(ball);

  moveAt(event.pageX, event.pageY);

  // moves the ball at (pageX, pageY) coordinates
  // taking initial shifts into account
  function moveAt(pageX, pageY) {
    element.style.left = pageX - shiftX + "px";
    element.style.top = pageY - shiftY + "px";
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  // move the ball on mousemove
  document.addEventListener("mousemove", onMouseMove);

  // drop the ball, remove unneeded handlers
  element.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    element.onmouseup = null;
  };
}
