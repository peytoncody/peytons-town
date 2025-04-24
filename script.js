const correctPassword = "peytonforpresident";

window.onload = () => {
  document.getElementById("login").style.display = "block";
};

function checkPassword() {
  const input = document.getElementById("password").value;
  if (input === correctPassword) {
    document.getElementById("login").style.display = "none";
    document.getElementById("diary").style.display = "block";
  } else {
    document.getElementById("error").innerText = "Wrong password, try again!";
  }
}

function saveEntry() {
  const title = document.getElementById("title").value;
  const entry = document.getElementById("entry").value;
  const blob = new Blob(
    [`Title: ${title}\n\nEntry:\n${entry}`],
    { type: "text/plain" }
  );

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${title || "Untitled"}-entry.txt`;
  link.click();

  document.getElementById("savedMessage").innerText = "Entry saved!";
  document.getElementById("entry").value = "";
  document.getElementById("title").value = "";
}
