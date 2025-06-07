import { MESSAGES } from "../utils/index.js";

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

function updateUI(isRecording) {
  if (isRecording) {
    startBtn.style.display = "none";
    stopBtn.style.display = "block";
  } else {
    startBtn.style.display = "block";
    stopBtn.style.display = "none";
  }
}

// On popup load, query background for recording status
chrome.runtime.sendMessage(
  { action: MESSAGES.GET_RECORDING_STATUS },
  (response) => {
    updateUI(response?.isRecording);
  }
);

// Start recording button
startBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage(
    { action: MESSAGES.START_RECORDING },
    (response) => {
      if (response?.success) updateUI(true);
    }
  );
});

// Stop recording button
stopBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage(
    { action: MESSAGES.STOP_RECORDING },
    (response) => {
      if (response?.success) updateUI(false);
    }
  );
});
