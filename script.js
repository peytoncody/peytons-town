const correctPassword = "peytonforpresident";
let selectedMood = "";

window.onload = () => {
  document.getElementById("login").style.display = "block";
  loadEntries();
};

function checkPassword() {
  const input = document.getElementById("password").value;
  if (input === correctPassword) {
    document.getElementById("login").style.display = "none";
    document.getElementById("diary").style.display = "block";
  } else {
    document.getElementById("error").innerText = "Wrong password, go away!";
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
  const entryData = { title, text, mood: selectedMood, date };

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

  entries.forEach(e => {
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `<strong>${e.date}</strong><br><em>${e.mood} ${e.title}</em><p>${e.text}</p><hr>`;
    list.appendChild(div);
  });
}
