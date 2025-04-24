const correctPassword = "peytonforpresident";
let selectedMood = "";

window.onload = () => {
  document.getElementById("login").style.display = "block";
  loadEntries();
  loadFont();
  loadBackground();
};

function checkPassword() {
  const input = document.getElementById("password").value;
  if (input === correctPassword) {
    document.getElementById("login").style.display = "none";
    document.getElementById("diary").style.display = "block";
    document.getElementById("diaryContent").style.display = "block"; // 👈 this is the new line!
  } else {
    document.getElementById("error").innerText = "Fuck off!";
  }
}

function selectMood(mood) {
  selectedMood = mood;
  const emojis = document.querySelectorAll(".emoji-bar span");
  emojis.forEach(e => e.style.opacity = "0.5");
  event.target.style.opacity = "1";
}

function saveEntry() {
  const title = document.getElementById("title").value || "Untitled";
  const text = document.getElementById("entry").value;
  const date = new Date().toLocaleString();
  const videoURL = localStorage.getItem("latestVideo") || null;
  const entryData = { title, text, mood: selectedMood, date, archived: false, video: videoURL };

  let entries = JSON.parse(localStorage.getItem("peytonsEntries") || "[]");
  entries.unshift(entryData);
  localStorage.setItem("peytonsEntries", JSON.stringify(entries));
  localStorage.removeItem("latestVideo");

  document.getElementById("savedMessage").innerText = "Entry saved!";
  document.getElementById("entry").value = "";
  document.getElementById("title").value = "";
  selectedMood = "";
  document.getElementById("videoPreview").style.display = "none";
  loadEntries();
}


function loadEntries() {
  const entries = JSON.parse(localStorage.getItem("peytonsEntries") || "[]");
  const list = document.getElementById("entryList");
  list.innerHTML = "";

  entries.forEach((e, i) => {
    if (e.archived) return;

    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `<strong>${e.date}</strong><br><em>${e.mood || ""} ${e.title}</em>
    <p contenteditable="false">${e.text}</p>
    ${e.video ? `<video controls style="max-width:100%;"><source src="${e.video}" type="video/webm"></video>` : ""}
    <button onclick="editEntry(${i})">✏️ Edit</button>
    <button onclick="archiveEntry(${i})">🗃️ Archive</button>
    <button onclick="deleteEntry(${i})">🗑️ Delete</button>
    <hr>`;
    list.appendChild(div);
  });
}


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
  if (confirm("Are you sure you want to delete this entry?")) {
    let entries = JSON.parse(localStorage.getItem("peytonsEntries") || "[]");
    entries.splice(index, 1);
    localStorage.setItem("peytonsEntries", JSON.stringify(entries));
    loadEntries();
  }
}

// Settings

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
document.getElementById("stealthToggle").onclick = () => {
  const isStealth = document.getElementById("stealthMode").style.display === "block";
  if (isStealth) {
    // Exit stealth mode
    document.getElementById("stealthMode").style.display = "none";
    document.getElementById("entryList").classList.remove("hidden");
    document.getElementById("entry").classList.remove("hidden");
    document.getElementById("title").classList.remove("hidden");
    document.querySelector("textarea").classList.remove("hidden");
    document.querySelector("button[onclick='saveEntry()']").classList.remove("hidden");
    localStorage.setItem("stealthMode", "off");
  } else {
    // Enter stealth mode
    document.getElementById("stealthMode").style.display = "block";
    document.getElementById("entryList").classList.add("hidden");
    document.getElementById("entry").classList.add("hidden");
    document.getElementById("title").classList.add("hidden");
    document.querySelector("textarea").classList.add("hidden");
    document.querySelector("button[onclick='saveEntry()']").classList.add("hidden");
    localStorage.setItem("stealthMode", "on");
  }
};

// Load stealth mode state
window.onload = () => {
  if (localStorage.getItem("stealthMode") === "on") {
    document.getElementById("stealthToggle").click();
  }
};

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
    div.innerHTML = `<strong>${e.date}</strong><br><em>${e.mood || ""} ${e.title}</em>
    <p>${e.text}</p>
    <button onclick="restoreEntry(${i})">Restore</button>
    <button onclick="deleteEntry(${i})">Delete Forever</button>
    <hr>`;
    list.appendChild(div);
  });
}

function restoreEntry(index) {
  const entries = JSON.parse(localStorage.getItem("peytonsEntries") || "[]");
  entries[index].archived = false;
  localStorage.setItem("peytonsEntries", JSON.stringify(entries));
  loadArchives();
  loadEntries();
}

function generateCalendar() {
  const container = document.getElementById("calendarContainer");
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

window.onload = () => {
  if (localStorage.getItem("stealthMode") === "on") {
    document.getElementById("stealthToggle").click();
  }
  loadEntries();
  loadFont();
  loadBackground();
  generateCalendar();
};

let mediaRecorder;
let recordedChunks = [];

function startRecording() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      document.getElementById("stopBtn").style.display = "inline";
      const video = document.getElementById("videoPreview");
      video.srcObject = stream;
      video.play();
      video.style.display = "block";

      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const videoURL = URL.createObjectURL(blob);
        video.src = videoURL;
        video.srcObject = null;
        localStorage.setItem("latestVideo", videoURL); // temporary store
      };
      recordedChunks = [];
      mediaRecorder.start();
    })
    .catch(err => alert("Camera access denied or unavailable."));
}

function stopRecording() {
  document.getElementById("stopBtn").style.display = "none";
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
  }
}

