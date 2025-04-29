const correctPassword = "peytonforpresident";
let selectedMood = "";
let sparkleAudio;

window.onload = () => {
  document.getElementById("login").style.display = "block";
  loadEntries();
  loadFont();
  setupSparkle();
  loadCalendar();
};

/* 🔐 Password Check */
function checkPassword() {
  const input = document.getElementById("password").value;
  if (input === correctPassword) {
    document.getElementById("login").style.display = "none";
    document.getElementById("diary").style.display = "block";
  } else {
    document.getElementById("error").innerText = "Access denied! 💥 Try again.";
  }
}

/* 🎀 Mood Selector */
function selectMood(mood) {
  selectedMood = mood;
  const emojis = document.querySelectorAll(".emoji-bar span");
  emojis.forEach(e => e.style.opacity = "0.5");
  event.target.style.opacity = "1";
}

/* 💌 Save Entry (now with optional video!) */
function saveEntry() {
  const title = document.getElementById("title").value || "Untitled";
  const text = document.getElementById("entry").value;
  const date = new Date().toLocaleString();
  const fileInput = document.getElementById("videoUpload");
  let videoURL = "";

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    videoURL = URL.createObjectURL(file);
  }

  const entryData = { title, text, mood: selectedMood, date, video: videoURL, archived: false };

  let entries = JSON.parse(localStorage.getItem("peytonsEntries") || "[]");
  entries.unshift(entryData);
  localStorage.setItem("peytonsEntries", JSON.stringify(entries));

  document.getElementById("savedMessage").innerText = "✨ Entry saved! ✨";
  document.getElementById("entry").value = "";
  document.getElementById("title").value = "";
  document.getElementById("videoUpload").value = "";
  selectedMood = "";
  loadEntries();
  triggerConfetti();
  playSparkle();
}

/* 📖 Load Entries */
function loadEntries() {
  const entries = JSON.parse(localStorage.getItem("peytonsEntries") || "[]");
  const list = document.getElementById("entryList");
  list.innerHTML = "";

  entries.forEach((e, i) => {
    if (e.archived) return;
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `
      <strong>${e.date}</strong><br><em>${e.mood || ""} ${e.title}</em>
      <p>${e.text}</p>
      ${e.video ? `<video controls src="${e.video}" width="100%" style="margin-top:10px;"></video>` : ""}
      <button onclick="editEntry(${i})">✏️ Edit</button>
      <button onclick="archiveEntry(${i})">🗃️ Archive</button>
      <button onclick="deleteEntry(${i})">🗑️ Delete</button>
    `;
    list.appendChild(div);
  });
}

/* 🎨 Entry Actions */
function editEntry(index) {
  let entries = JSON.parse(localStorage.getItem("peytonsEntries") || "[]");
  const newText = prompt("Edit your entry:", entries[index].text);
  if (newText !== null) {
    entries[index].text = newText;
    localStorage.setItem("peytonsEntries", JSON.stringify(entries));
    loadEntries();
  }
}

function archiveEntry(index) {
  let entries = JSON.parse(localStorage.getItem("peytonsEntries") || "[]");
  entries[index].archived = true;
  localStorage.setItem("peytonsEntries", JSON.stringify(entries));
  loadEntries();
}

function deleteEntry(index) {
  if (confirm("Delete this forever?")) {
    let entries = JSON.parse(localStorage.getItem("peytonsEntries") || "[]");
    entries.splice(index, 1);
    localStorage.setItem("peytonsEntries", JSON.stringify(entries));
    loadEntries();
  }
}

/* 🗃️ Archives */
function toggleArchiveView() {
  const list = document.getElementById("archiveList");
  list.style.display = list.style.display === "block" ? "none" : "block";
  if (list.style.display === "block") loadArchives();
}

function loadArchives() {
  const list = document.getElementById("archiveList");
  const entries = JSON.parse(localStorage.getItem("peytonsEntries") || "[]");
  list.innerHTML = "";

  entries.forEach((e, i) => {
    if (!e.archived) return;
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `
      <strong>${e.date}</strong><br><em>${e.mood || ""} ${e.title}</em>
      <p>${e.text}</p>
      ${e.video ? `<video controls src="${e.video}" width="100%" style="margin-top:10px;"></video>` : ""}
      <button onclick="restoreEntry(${i})">🔁 Restore</button>
      <button onclick="deleteEntry(${i})">❌ Delete Forever</button>
    `;
    list.appendChild(div);
  });
}

function restoreEntry(index) {
  let entries = JSON.parse(localStorage.getItem("peytonsEntries") || "[]");
  entries[index].archived = false;
  localStorage.setItem("peytonsEntries", JSON.stringify(entries));
  loadArchives();
  loadEntries();
}

/* 🎀 Settings */
document.getElementById("settingsToggle").onclick = () => {
  const panel = document.getElementById("settingsPanel");
  panel.style.display = panel.style.display === "none" ? "block" : "none";
};

document.getElementById("fontSelector").onchange = (e) => {
  const font = e.target.value;
  document.body.style.fontFamily = font;
  localStorage.setItem("peytonsFont", font);
};

function loadFont() {
  const savedFont = localStorage.getItem("peytonsFont");
  if (savedFont) {
    document.body.style.fontFamily = savedFont;
    document.getElementById("fontSelector").value = savedFont;
  }
}

/* 🐰 Stealth Mode */
document.getElementById("stealthToggle").onclick = () => {
  const diary = document.getElementById("diary");
  const stealth = document.getElementById("stealthMode");
  if (!stealth) return;

  if (stealth.style.display === "block") {
    stealth.style.display = "none";
    diary.style.opacity = "1";
  } else {
    stealth.style.display = "block";
    diary.style.opacity = "0.1";
  }
};

/* 🎉 Confetti Party */
function triggerConfetti() {
  for (let i = 0; i < 60; i++) {
    let confetti = document.createElement("div");
    confetti.innerText = ["🎀", "🌸", "💖", "✨", "🎉"][Math.floor(Math.random() * 5)];
    confetti.style.position = "fixed";
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.top = "-20px";
    confetti.style.fontSize = "1.5rem";
    confetti.style.zIndex = 999;
    confetti.style.animation = "fall 2s linear forwards";
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 2000);
  }
}

/* 🎶 Sparkle Sound */
function setupSparkle() {
  sparkleAudio = document.getElementById("sparkleSound");
}

function playSparkle() {
  if (sparkleAudio) {
    sparkleAudio.currentTime = 0;
    sparkleAudio.play();
  }
}

/* 🗓️ Calendar */
function loadCalendar() {
  const container = document.getElementById("calendarContainer");
  if (!container) return;
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const entries = JSON.parse(localStorage.getItem("peytonsEntries") || "[]");
  const entryDates = entries.map(e => new Date(e.date).toDateString());

  container.innerHTML = "";

  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement("div");
    container.appendChild(blank);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const div = document.createElement("div");
    div.className = "calendar-day";

    const dateStr = date.toDateString();
    if (entryDates.includes(dateStr)) {
      div.classList.add("has-entry");
      div.onclick = () => showEntryByDate(dateStr);
    }

    div.innerText = d;
    container.appendChild(div);
  }
}

function showEntryByDate(dateStr) {
  const entries = JSON.parse(localStorage.getItem("peytonsEntries") || "[]");
  const entry = entries.find(e => new Date(e.date).toDateString() === dateStr);
  if (entry) {
    alert(`Title: ${entry.title}\nMood: ${entry.mood || ""}\n\n${entry.text}`);
  } else {
    alert("No entry found for this day.");
  }
}

/* ✨ Confetti Animation */
const style = document.createElement('style');
style.innerHTML = `
@keyframes fall {
  0% { top: -20px; opacity: 1; transform: rotate(0); }
  100% { top: 100vh; opacity: 0; transform: rotate(360deg); }
}`;
document.head.appendChild(style);
