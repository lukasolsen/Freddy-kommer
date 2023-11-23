import {
  getRandomImage,
  checkImages,
  loadImages,
  getCurrentTab,
} from "./utils/utils";
import { consoleLog, Severity } from "./styles/styles";

import Youtube from "./loaders/Youtube";

let images: Image[] = [];

const reactionFeature = () => {
  // Check if the current url is a youtube video
  // If it is then apply a abselute div with an image

  if (chrome.tabs.query({ active: true, currentWindow: true })) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url;
      if (url.includes("youtube.com/watch")) {
        // Apply overlay
        const randomImage = getRandomImage(images);
        const elem = document.createElement("div");
        elem.style.position = "absolute";
        elem.style.top = "0";
        elem.style.left = "0";
        elem.style.zIndex = "1000000000";
        elem.style.width = "100%";

        const img = document.createElement("img");
        img.src = randomImage;
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "cover";
        img.style.pointerEvents = "none";
        elem.appendChild(img);

        document.querySelector(".html5-video-container")?.appendChild(elem);
      }
    });
  }
};

const start = async () => {
  consoleLog(Severity.WELCOME);
  await loadImages().then((loadedImages) => {
    images = checkImages(loadedImages);
  });

  if ((await getCurrentTab()).includes("youtube.com")) {
    const youtube = new Youtube(images);
    youtube.run();
  }
};

start();
