const correctPassword = "peytonforpresident";
let mediaRecorder;
let recordedBlobs = [];

function checkPassword() {
  const input = document.getElementById("password").value;
  if (input === correctPassword) {
    document.getElementById("login").style.display = "none";
    document.getElementById("diary").style.display = "block";
    loadEntries();
  } else {
    document.getElementById("error").innerText = "Wrong password!";
  }
}

function saveEntry() {
  const title = document.getElementById("title").value || "Untitled";
  const text = document.getElementById("entry").value;
  const date = new Date().toLocaleString();
  const videoData = recordedBlobs.length ? URL.createObjectURL(new Blob(recordedBlobs, { type: "video/webm" })) : null;

  let entries = JSON.parse(localStorage.getItem("peytonsEntries") || "[]");
  entries.unshift({ title, text, date, video: videoData });
  localStorage.setItem("peytonsEntries", JSON.stringify(entries));

  document.getElementById("title").value = "";
  document.getElementById("entry").value = "";
  document.getElementById("savedMessage").innerText = "Entry saved!";
  recordedBlobs = [];

  loadEntries();
}

function loadEntries() {
  const entries = JSON.parse(localStorage.getItem("peytonsEntries") || "[]");
  const list = document.getElementById("entryList");
  list.innerHTML = "";

  entries.forEach((e, i) => {
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `
      <strong>${e.date}</strong><br><em>${e.title}</em>
      <p>${e.text}</p>
      ${e.video ? `<video controls src="${e.video}"></video>` : ""}
      <br><button onclick="editEntry(${i})">✏️ Edit</button>
      <button onclick="deleteEntry(${i})">🗑️ Delete</button>
    `;
    list.appendChild(div);
  });
}

function editEntry(i) {
  const entries = JSON.parse(localStorage.getItem("peytonsEntries") || "[]");
  const updated = prompt("Edit your entry:", entries[i].text);
  if (updated !== null) {
    entries[i].text = updated;
    localStorage.setItem("peytonsEntries", JSON.stringify(entries));
    loadEntries();
  }
}

function deleteEntry(i) {
  const entries = JSON.parse(localStorage.getItem("peytonsEntries") || "[]");
  if (confirm("Delete this entry forever?")) {
    entries.splice(i, 1);
    localStorage.setItem("peytonsEntries", JSON.stringify(entries));
    loadEntries();
  }
}

document.getElementById("startRecording").onclick = async () => {
  recordedBlobs = [];
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.ondataavailable = (e) => recordedBlobs.push(e.data);
  mediaRecorder.onstop = () => {
    const video = document.getElementById("recordedVideo");
    video.src = URL.createObjectURL(new Blob(recordedBlobs, { type: "video/webm" }));
  };
  mediaRecorder.start();
  document.getElementById("stopRecording").disabled = false;
};

document.getElementById("stopRecording").onclick = () => {
  mediaRecorder.stop();
  document.getElementById("stopRecording").disabled = true;
};
