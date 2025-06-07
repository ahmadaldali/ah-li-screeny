import { getTimestamp, MESSAGES } from "../utils/index.js";

let mediaRecorder;
let stream;
let chunks = [];

const beginScreenCapture = async () => {
  try {
    stream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor: "always",
        displaySurface: "monitor", // user still selects
      },
      audio: true,
    });

    mediaRecorder = new MediaRecorder(stream);
    chunks = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      stream.getTracks().forEach((track) => track.stop());

      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);

      const filename = `ah-li-screeny-${getTimestamp()}.webm`;

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();

      URL.revokeObjectURL(url);
    };

    mediaRecorder.start();
  } catch (err) {
    console.error("Error accessing display media.", err);
  }
};

chrome.runtime.onMessage.addListener((msg) => {
  switch (msg.action) {
    case MESSAGES.OFFSCREEN_BEGIN_CAPTURE:
      beginScreenCapture();
      break;
    case MESSAGES.OFFSCREEN_STOP_CAPTURE:
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
      }
      break;
    default:
      console.warn("Unknown message action in offscreen:", msg.action);
      break;
  }
});
