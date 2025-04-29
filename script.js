const correctPassword = "peytonforpresident";
let selectedMood = "";
let mediaRecorder;
let recordedBlobs = [];

/* Password Check */
function checkPassword() {
  const input = document.getElementById("password").value;
  if (input === correctPassword) {
    document.getElementById("login").style.display = "none";
    document.getElementById("diary").style.display = "block";
    loadEntries();
    loadFont();
    loadBackground();
    generateCalendar();
  } else {
    document.getElementById("error").innerText = "Wrong password!";
  }
}

/* Save Entry */
function saveEntry() {
  const title = document.getElementById("title").value || "Untitled";
  const text = document.getElementById("entry").value;
  const date = new Date().toLocaleString();
  let videoData = "";

  if (recordedBlobs.length > 0) {
    videoData = URL.createObjectURL(new Blob(recordedBlobs, { type: 'video/webm' }));
  }

  const entryData = { title, text, mood: selectedMood, date, video: videoData, archived: false };

  let entries = JSON.parse(localStorage.getItem("peytonsEntries") || "[]");
  entries.unshift(entryData);
  localStorage.setItem("peytonsEntries", JSON.stringify(entries));

  document.getElementById("savedMessage").innerText = "✨ Entry Saved!";
  document.getElementById("title").value = "";
  document.getElementById("entry").value = "";
  recordedBlobs = [];
  document.getElementById("recordedVideo").src = "";
  selectedMood = "";

  loadEntries();
  playSparkle();
  triggerConfetti();
}

/* Load Entries */
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
      ${e.video ? `<video controls src="${e.video}" style="margin-top: 10px;"></video>` : ""}
      <br>
      <button onclick="editEntry(${i})">✏️ Edit</button>
      <button onclick="archiveEntry(${i})">🗃️ Archive</button>
      <button onclick="deleteEntry(${i})">🗑️ Delete</button>
    `;
    list.appendChild(div);
  });
}

/* Edit, Archive, Delete */
function editEntry(index) {
  let entries = JSON.parse(localStorage.getItem("peytonsEntries") || "[]");
  const updated = prompt("Edit your entry:", entries[index].text);
  if (updated !== null) {
    entries[index].text = updated;
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
  if (confirm("Delete forever?")) {
    let entries = JSON.parse(localStorage.getItem("peytonsEntries") || "[]");
    entries.splice(index, 1);
    localStorage.setItem("peytonsEntries", JSON.stringify(entries));
    loadEntries();
  }
}

/* Settings Panel */
document.getElementById("settingsToggle").onclick = () => {
  const panel = document.getElementById("settingsPanel");
  panel.style.display = panel.style.display === "none" ? "block" : "none";
};

/* Font Selector */
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

/* Background Image */
document.getElementById("bgUpload").addEventListener("change", function () {
  const file = this.files[0];
  const reader = new FileReader();
  reader.onload = function () {
    document.body.style.backgroundImage = `url(${reader.result})`;
    localStorage.setItem("peytonsBG", reader.result);
  };
  if (file) reader.readAsDataURL(file);
});

function loadBackground() {
  const bg = localStorage.getItem("peytonsBG");
  if (bg) {
    document.body.style.backgroundImage = `url(${bg})`;
  }
}

/* Mood Selector */
function selectMood(mood) {
  selectedMood = mood;
  const emojis = document.querySelectorAll(".emoji-bar span");
  emojis.forEach(e => e.style.opacity = "0.5");
  event.target.style.opacity = "1";
}

/* Stealth Mode */
document.getElementById("stealthToggle").onclick = () => {
  const diary = document.getElementById("diary");
  diary.style.display = diary.style.display === "none" ? "block" : "none";
};

/* Sparkle Sound */
function playSparkle() {
  const sparkleSound = document.getElementById("sparkleSound");
  if (sparkleSound) {
    sparkleSound.currentTime = 0;
    sparkleSound.play();
  }
}

/* Confetti Effect */
function triggerConfetti() {
  for (let i = 0; i < 50; i++) {
    let confetti = document.createElement("div");
    confetti.innerText = ["🎀", "🌸", "💖", "🎉", "🩰"][Math.floor(Math.random() * 5)];
    confetti.style.position = "fixed";
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.top = "-20px";
    confetti.style.fontSize = "1.5em";
    confetti.style.zIndex = 999;
    confetti.style.animation = "fall 2s linear forwards";
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 2000);
  }
}

/* Calendar View */
function generateCalendar() {
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

/* Video Recorder */
document.getElementById("startRecording").onclick = async () => {
  recordedBlobs = [];
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  const videoElement = document.getElementById("recordedVideo");
  videoElement.srcObject = stream;
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.ondataavailable = (e) => recordedBlobs.push(e.data);
  mediaRecorder.start();
  document.getElementById("stopRecording").disabled = false;
};

document.getElementById("stopRecording").onclick = () => {
  mediaRecorder.stop();
  document.getElementById("stopRecording").disabled = true;
  const videoElement = document.getElementById("recordedVideo");
  videoElement.srcObject.getTracks().forEach(track => track.stop());
};
