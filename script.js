const screen = document.getElementById("screen");

// one cursor that we move around, so it always sits at the end of the latest line
const cursor = document.createElement("span");
cursor.className = "cursor";
cursor.textContent = "█";

function wait(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

// types text into an element one character at a time
function typeInto(el, text, speed) {
  return new Promise(function (resolve) {
    let i = 0;
    const timer = setInterval(function () {
      el.textContent += text[i];
      i++;
      if (i === text.length) {
        clearInterval(timer);
        resolve();
      }
    }, speed);
  });
}

// prints an output line and returns the span inside it
function addLine(text, className) {
  const line = document.createElement("div");
  line.className = "line " + (className || "");
  const span = document.createElement("span");
  span.textContent = text;
  line.appendChild(span);
  line.appendChild(cursor);
  screen.appendChild(line);
  screen.scrollTop = screen.scrollHeight;
  return span;
}

// prints the two-line Kali prompt and returns the span where the command is typed
function addPrompt() {
  const top = document.createElement("div");
  top.className = "line prompt";
  top.textContent = "┌──(kali㉿birthday)-[~]";
  screen.appendChild(top);

  const bottom = document.createElement("div");
  bottom.className = "line prompt";
  bottom.textContent = "└─$ ";
  const cmd = document.createElement("span");
  cmd.className = "cmd";
  bottom.appendChild(cmd);
  bottom.appendChild(cursor);
  screen.appendChild(bottom);

  screen.scrollTop = screen.scrollHeight;
  return cmd;
}

async function runCommand(text) {
  const cmd = addPrompt();
  await wait(600);
  await typeInto(cmd, text, 70);
  await wait(400);              // the "pressing Enter" pause
}

let stopped = false;
let floodRunning = false;
let checkShown = false;
const FLOOD_COUNT = 25;   // pop-ups the script throws on its own
const POPUP_LIMIT = 70;   // total pop-ups, including the ones he spawns by clicking
const IDLE_MS = 12000;    // question appears if he doesn't click for this long
let lastClick = 0;

document.addEventListener("keydown", function (e) {
  if (e.key === "5" && floodRunning) showBirthdayCheck();
});

// ---- pop-ups ----
const ERRORS = [
  "Segmentation fault (core dumped)",
  "bash: page.html: No such file or directory",
  "Kernel panic - not syncing: birthday not found",
  "Permission denied: you are not root on this birthday",
  "Out of memory: Killed process 1337 (happiness)",
  "Warning: cake.service failed to start",
  "Disk full: too many memes",
  "Error 404: landing page not found",
  "Unable to resolve host: surprise.local"
];

const MEMES = ["images/meme1.gif", "images/meme2.gif", "images/meme3.gif"];
MEMES.forEach(function (src) { new Image().src = src; });

const CODE_MEMES = [
  { file: "fix.py",   lines: ["# TODO: fix this later", "# (written 3 years ago)"] },
  { file: "main.c",   lines: ["sleep(5);", "// do not remove,", "// everything breaks"] },
  { file: "terminal", lines: ["$ git commit -m \"fix\"", "$ git commit -m \"fix again\"", "$ git commit -m \"final fix 2\""] },
  { file: "life.js",  lines: ["while (!asleep) {", "  code();", "  coffee++;", "}"] },
  { file: "app.py",   lines: ["try:", "    run_everything()", "except:", "    pass  # solved"] },
  { file: "main.cpp", lines: ["// 99 little bugs in the code", "// patch one, compile again...", "// 127 little bugs in the code"] }
];

const CAPTIONS = [
  { top: "Me: it's a one-line fix", bottom: "Me, 6 hours later:", emoji: "😵" },
  { top: "3 hours of debugging", bottom: "The bug was a typo. The typo was mine.", emoji: "🤡" },
  { top: "Works on my machine", bottom: "Then we'll ship the machine", emoji: "📦" },
  { top: "Stack Overflow answer:", bottom: "\"Why would you even want to do that?\"", emoji: "🙃" }
];

const CHOICES = [
  { q: "sudo rm -rf / : are you sure?", a: "No", b: "Obviously not" },
  { q: "Have you tried turning it off and on again?", a: "Yes", b: "No" },
  { q: "Update available. Restart now?", a: "Later", b: "Remind me in 5 minutes" },
  { q: "Allow birthday.sh to access your cake?", a: "Allow", b: "Allow" }
];

const counters = { error: 0, meme: 0, code: 0, caption: 0, choice: 0 };
function nextOf(list, key) { return list[counters[key]++ % list.length]; }

let popupCount = 0;
let topZ = 10;
const MAX_POPUPS = 30;

function placePopup(popup) {
  const x = Math.random() * Math.max(0, window.innerWidth - popup.offsetWidth);
  const y = Math.random() * Math.max(0, window.innerHeight - popup.offsetHeight);
  popup.style.left = x + "px";
  popup.style.top = y + "px";
}

function randomKind() {
  const r = Math.random();
  if (r < 0.35) return "error";
  if (r < 0.55) return "meme";
  if (r < 0.75) return "code";
  if (r < 0.90) return "caption";
  return "choice";
}

function spawnPopup(kind) {
  if (stopped) return;
  if (popupCount >= POPUP_LIMIT) { showBirthdayCheck(); return; }
  popupCount++;
  if (!kind) kind = randomKind();

  const popup = document.createElement("div");
  popup.className = "popup " + kind;
  popup.style.zIndex = ++topZ;

  // closing a pop-up makes two more appear
  function close() {
    lastClick = Date.now();
    popup.remove();
    spawnPopup();
    spawnPopup();
  }

  function addBar(title) {
    const bar = document.createElement("div");
    bar.className = "bar";
    const t = document.createElement("span");
    t.textContent = title;
    const x = document.createElement("span");
    x.className = "x";
    x.textContent = "✕";
    x.onclick = close;
    bar.appendChild(t);
    bar.appendChild(x);
    popup.appendChild(bar);
  }

  function addMessage(icon, text) {
    const body = document.createElement("div");
    body.className = "body";
    const i = document.createElement("span");
    i.className = "icon";
    i.textContent = icon;
    const m = document.createElement("span");
    m.className = "msg";
    m.textContent = text;
    body.appendChild(i);
    body.appendChild(m);
    popup.appendChild(body);
  }

  function addButtons(labels) {
    const row = document.createElement("div");
    row.className = "actions";
    labels.forEach(function (label) {
      const b = document.createElement("button");
      b.textContent = label;
      b.onclick = close;
      row.appendChild(b);
    });
    popup.appendChild(row);
  }

  if (kind === "error") {
    addBar("Error");
    addMessage("⚠️", nextOf(ERRORS, "error"));
    addButtons(["OK"]);

  } else if (kind === "meme") {
    addBar("meme.gif");
    const img = document.createElement("img");
    img.src = nextOf(MEMES, "meme");
    img.alt = "meme";
    img.onload = function () { placePopup(popup); };
    popup.appendChild(img);

  } else if (kind === "code") {
    const c = nextOf(CODE_MEMES, "code");
    addBar(c.file);
    const pre = document.createElement("pre");
    pre.className = "code";
    pre.textContent = c.lines.join("\n");
    popup.appendChild(pre);

  } else if (kind === "caption") {
    const c = nextOf(CAPTIONS, "caption");
    addBar("meme.jpg");
    const box = document.createElement("div");
    box.className = "caption";
    ["top", "emoji", "bottom"].forEach(function (part) {
      const d = document.createElement("div");
      d.className = part;
      d.textContent = c[part];
      box.appendChild(d);
    });
    popup.appendChild(box);

  } else if (kind === "choice") {
    const c = nextOf(CHOICES, "choice");
    addBar("System");
    addMessage("❓", c.q);
    addButtons([c.a, c.b]);
  }

  document.body.appendChild(popup);
  placePopup(popup);
}

// the order of pop-ups in the flood, repeated as needed
const FLOOD_KINDS = ["error", "code", "error", "meme", "caption", "error", "choice", "code", "meme", "error"];

async function popupFlood() {
  floodRunning = true;
  let delay = 900;
  for (let i = 0; i < FLOOD_COUNT; i++) {
    if (stopped) break;
    spawnPopup(FLOOD_KINDS[i % FLOOD_KINDS.length]);
    await wait(delay);
    delay = Math.max(110, delay * 0.82);
  }

  // play phase: he can click around until the limit, the idle timer or the 5 key
  lastClick = Date.now();
  while (!stopped && Date.now() - lastClick < IDLE_MS) {
    await wait(300);
  }
  showBirthdayCheck();
}

const WRONG = [
  "That's not \"yes\". Try again.",
  "Invalid response. Expected: yes",
  "Still not \"yes\". Take your time."
];

function showBirthdayCheck() {
  if (checkShown) return;
  checkShown = true;
  stopped = true;
  floodRunning = false;

  const overlay = document.createElement("div");
  overlay.id = "overlay";
  overlay.innerHTML =
    '<div class="popup check">' +
      '<div class="bar"><span>Confirmation required</span></div>' +
      '<div class="body"><span class="icon">❓</span>' +
        '<span class="msg">Is it really your birthday today?<br>Type "yes" to confirm.</span></div>' +
      '<div class="field"><input type="text" autocomplete="off" autocapitalize="off" spellcheck="false"></div>' +
      '<div class="note"></div>' +
      '<div class="actions"><button>Confirm</button></div>' +
    '</div>';
  document.body.appendChild(overlay);

  const input = overlay.querySelector("input");
  const note = overlay.querySelector(".note");
  let tries = 0;

  function submit() {
    if (input.value.trim().toLowerCase() === "yes") {
      onBirthdayConfirmed(overlay);
    } else {
      note.textContent = WRONG[tries++ % WRONG.length];
      input.value = "";
      input.focus();
    }
  }

  overlay.querySelector("button").onclick = submit;
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") submit();
  });
  input.focus();
}

function onBirthdayConfirmed(overlay) {
  overlay.remove();
  console.log("confirmed");
  // next: terms and conditions, then static + glitch, then Interstellar
}

async function playIntro() {
  await wait(800);

  await runCommand("sudo ./load_page.sh");
  addLine("[sudo] password for kali: ********");
  await wait(900);
  addLine("[ OK ] Started Birthday Network Manager.");
  await wait(400);
  addLine("[ OK ] Reached target Cake Services.");
  await wait(400);
  addLine("Loading page.html ...");
  await wait(1500);

  await runCommand("balloons page.html");
  addLine("Happy Birthday!");
  await wait(2000);

  await runCommand("wc -l page.html");
  addLine("1 page.html");
  await wait(1200);

  const prank = addLine("", "err");
  await typeInto(prank, "Oh wait, that's not right... Where is the rest of the file?", 55);
  await wait(1500);

  addPrompt();
  await wait(1200);
  await popupFlood();
}

playIntro();