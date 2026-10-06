const terminal = document.getElementById("terminal");
const page = document.getElementById("page");

// load the gifs early so there's no gap
["images/meme1.gif", "images/meme2.gif"].forEach(function (src) {
  new Image().src = src;
});

function wait(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

function typeLine(text, speed, tag) {
  return new Promise(function (resolve) {
    const line = document.createElement(tag || "p");
    terminal.appendChild(line);
    let i = 0;
    const timer = setInterval(function () {
      line.textContent += text[i];
      i++;
      if (i === text.length) {
        clearInterval(timer);
        resolve();
      }
    }, speed);
  });
}

function showImage(src) {
  const img = document.createElement("img");
  img.src = src;
  img.alt = "meme";
  img.className = "meme";
  terminal.appendChild(img);
  return img;
}

function makeMan() {
  return document.getElementById("man-tpl").content.firstElementChild.cloneNode(true);
}

// Moves the man to a new pose. Only list the angles you want to change.
// ar/er = right upper arm / forearm, al/el = left, tr/kr = right thigh / shin,
// tl/kl = left, y = how far below the screen edge he is (in px).
function pose(man, p, seconds) {
  man.style.setProperty("--d", seconds + "s");
  man.style.transition = "transform " + seconds + "s ease-in-out";
  for (const key in p) {
    if (key === "y") {
      man.style.transform = "translateY(" + p.y + "px)";
    } else {
      man.style.setProperty("--" + key, p[key] + "deg");
    }
  }
  return wait(seconds * 1000);
}

async function climbUp(man) {
  // 1. a hand shoots over the edge, then the other
  await pose(man, { ar: -165 }, 0.25);
  await wait(500);
  await pose(man, { al: -172 }, 0.25);
  await wait(700);

  // 2. pull up until his chin is over the edge
  await pose(man, { y: 106, ar: -108, er: -99, al: -114, el: -105 }, 0.9);
  await pose(man, { y: 95, ar: -79, er: -130, al: -90, el: -137 }, 0.9);
  await wait(400);

  // 3. keep pulling until his chest is over
  await pose(man, { y: 80, ar: -15, er: -151, al: -8, el: -164 }, 1);
  await pose(man, { y: 58, ar: 29, er: -112, al: 44, el: -118 }, 1);
  await wait(400);

  // 4. throw one leg over the edge
  await pose(man, { tr: -152, kr: 88 }, 0.8);
  await wait(300);

  // 5. scramble onto the ledge, second leg comes up too
  await pose(man, { y: 44, ar: 14, er: -62, al: 24, el: -68, tr: -129, kr: 93, tl: -143, kl: 131 }, 1.1);
  await wait(400);

  // 6. stand up slowly
  await pose(man, { y: 26, ar: 8, er: -25, al: 8, el: -25, tr: -60, kr: 120, tl: -60, kl: 120 }, 1.3);
  await pose(man, { y: 10, ar: 0, er: 0, al: 0, el: 0, tr: -30, kr: 60, tl: -30, kl: 60 }, 1.2);
  await pose(man, { y: 0, tr: 0, kr: 0, tl: 0, kl: 0 }, 0.9);
}

async function stickManDrag() {
  // 1. climb up over the bottom edge
  const man = makeMan();
  man.classList.add("walker", "climbing");
  man.style.transform = "translateY(120px)";   // fully hidden below the screen
  document.body.appendChild(man);
  await wait(300);
  await climbUp(man);
  man.classList.remove("climbing");

  // 2. turn to face the screen, wave and say hi
  man.classList.remove("walking");
  man.classList.add("front");
  await wait(500);
  man.classList.add("waving");
  await wait(2500);
  man.classList.remove("waving");
  await wait(500);
  man.classList.remove("front");
  await wait(400);

  // 3. look around for the page
  man.style.scale = "-1 1";
  await wait(900);
  man.style.scale = "1 1";
  await wait(900);
  man.style.scale = "-1 1";
  await wait(700);
  man.style.scale = "1 1";
  await wait(600);

  // 4. walk off to the right
  man.classList.add("walking");
  man.style.transition = "transform 7s linear";
  man.style.transform = "translateX(" + (window.innerWidth + 100) + "px)";
  await wait(7100);
  man.remove();

  // 5. he returns, dragging the page in from the right
  const puller = makeMan();
  puller.classList.add("puller", "walking");
  puller.style.scale = "-1 1";
  page.appendChild(puller);
  page.style.transition = "transform 6s linear";
  page.style.transform = "translateX(0)";
  await wait(6200);

  // 6. clean up
  puller.remove();
  page.style.transition = "none";
  page.style.transform = "none";
  page.classList.add("done");
  terminal.remove();
}

async function playIntro() {
  await typeLine("Loading...", 80, "h1");
  await wait(2000);
  await typeLine("Happy Birthday!", 80, "h1");
  await wait(2000);
  await typeLine("Oh wait, that's not right... Where is the rest of the file?", 50, "h1");
  const cry = showImage("images/meme1.gif");
  await wait(3000);
  cry.remove();
  showImage("images/meme2.gif");
  await wait(4000);
  await stickManDrag();
}

playIntro();