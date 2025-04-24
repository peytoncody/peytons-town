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
  const entryData = { title, text, mood: selectedMood, date, archived: false };

  let entries = JSON.parse(localStorage.getItem("peytonsEntries") || "[]");
  entries.unshift(entryData);
  localStorage.setItem("peytonsEntries", JSON.stringify(entries));

  document.getElementById("savedMessage").innerText = "Entry saved!";
  document.getElementById("entry").value = "";
  document.getElementById("title").value = "";
  selectedMood = "";
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
