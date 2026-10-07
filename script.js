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
  // next: memes, error pop-ups, glitch, reboot
}

playIntro();