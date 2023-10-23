import { getRandomImage } from "./utils/utils";
import { consoleLog, Severity } from "./styles/styles";
import { YOUTUBE_VIDEO_QUERY, YOUTUBE_SHORTS_QUERY } from "./env/paths";

let images: Image[] = [];
// just save the imagesChanged for checking weather a new change has been made

const loadImages = async () => {
  const imageFileURL = chrome.runtime.getURL("/images.json");
  //console.log("Loading images from " + imageFileURL);
  consoleLog(Severity.INFO, "Loading images from " + imageFileURL);

  await fetch(imageFileURL)
    .then((response) => response.json())
    .then((json: Image[]) => {
      //console.log("Loaded images");
      consoleLog(Severity.INFO, "Loaded images");
      //console.log(json);
      consoleLog(Severity.INFO, json);
      images = json;
    });
};

// Apply the overlay
function applyOverlay(
  thumbnailElement: HTMLElement,
  overlayImageURL: string,
  flip = false
) {
  if (
    thumbnailElement.nodeName === "IMG" ||
    thumbnailElement.nodeName === "YT-IMAGE"
  ) {
    // Create a new img element for the overlay
    const overlayImage = document.createElement("img");
    overlayImage.src = overlayImageURL;
    overlayImage.style.position = "absolute";
    overlayImage.style.top = "0";
    overlayImage.style.left = "0";
    overlayImage.style.width = "100%";
    overlayImage.style.height = "100%";
    overlayImage.style.zIndex = "0"; // Ensure overlay is on top but below the time indicator
    if (flip) {
      overlayImage.style.transform = "scaleX(-1)"; // Flip the image horizontally
    }
    thumbnailElement.style.position = "relative"; // Style the thumbnailElement to handle absolute positioning
    if (thumbnailElement.parentElement) {
      thumbnailElement.parentElement.appendChild(overlayImage);
      thumbnailElement.dataset.tag = "Freddy Comin' For You";
    } else {
      console.warn("No parent element found");
    }
  } else if (thumbnailElement.nodeName === "DIV") {
    thumbnailElement.style.backgroundImage =
      `url("${overlayImageURL}"), ` +
      (thumbnailElement.style.backgroundImage || "");
  }
}

const applyOverlays = () => {
  //console.log("Applying overlays");
  consoleLog(Severity.INFO, "Applying overlays");
  const thumbnailElements = identifyVideos();
  thumbnailElements.forEach((thumbnailElement) => {
    if (thumbnailElement.dataset?.tag === "Freddy Comin' For You") {
      return;
    }
    const randomImage = getRandomImage(images);
    applyOverlay(thumbnailElement, randomImage);
  });
};

const identifyVideos = () => {
  const thumbnailElements: NodeListOf<HTMLElement> =
    document.querySelectorAll(YOUTUBE_VIDEO_QUERY);
  const shortsThumbnailElements: NodeListOf<HTMLElement> =
    document.querySelectorAll(YOUTUBE_SHORTS_QUERY);

  return [...thumbnailElements, ...shortsThumbnailElements];
};

const start = async () => {
  //console.log("Starting MrBeastify extension");
  //consoleLog(Severity.INFO, "Starting MrBeastify extension");
  consoleLog(Severity.WELCOME);
  await loadImages();
  //await preloadImages();

  const video = new MutationObserver(applyOverlays);
  video.observe(document.body, {
    childList: true,
    subtree: true,
  });

  applyOverlays();
};

start();
