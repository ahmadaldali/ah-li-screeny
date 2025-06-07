import { MESSAGES } from "./utils/messages.js";

let isRecording = false;

async function startRecording() {
  isRecording = true;

  const hasOffscreen = await chrome.offscreen.hasDocument();
  if (!hasOffscreen) {
    await chrome.offscreen.createDocument({
      url: chrome.runtime.getURL("offscreen.html"),
      reasons: ["USER_MEDIA"],
      justification: "Screen recording without visible UI",
    });
  }

  chrome.runtime.sendMessage({ action: MESSAGES.OFFSCREEN_BEGIN_CAPTURE });
}

function stopRecording() {
  isRecording = false;
  chrome.runtime.sendMessage({ action: MESSAGES.OFFSCREEN_STOP_CAPTURE });
}

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  (async () => {
    switch (message.action) {
      case MESSAGES.START_RECORDING:
        await startRecording();
        sendResponse({ success: true });
        break;

      case MESSAGES.STOP_RECORDING:
        stopRecording();
        sendResponse({ success: true });
        break;

      case MESSAGES.GET_RECORDING_STATUS:
        sendResponse({ isRecording });
        break;

      default:
        console.warn(
          "Unknown message action in background.js:",
          message.action
        );
        break;
    }
  })();

  return true; // Keep message channel open for async sendResponse
});
