import { getRandomImage, checkImages } from "./utils/utils";
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
      // TODO: Add a checker using regex to see if it is a valid image url or a image file.
      const checkedImages = checkImages(json);

      consoleLog(Severity.INFO, "Loaded images");
      images = checkedImages;
    });
};

// Apply the overlay
function applyOverlay(
  thumbnailElement: HTMLElement,
  overlayImageURL: string,
  flip = false
) {
  if (thumbnailElement.nodeName === "IMG") {
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
      thumbnailElement.setAttribute("data-tag", "Freddy Comin' For You");
      thumbnailElement.setAttribute("data-type", "overlay");
    } else {
      consoleLog(Severity.WARNING, "No parent element found");
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

// Check if all images that has the data-tag includes the current image, if not then redo it.
const quickCheck = () => {
  const thumbnailElements = identifyVideos();
  thumbnailElements.forEach((thumbnailElement) => {
    if (thumbnailElement.dataset?.tag !== "Freddy Comin' For You") {
      return;
    } else {
      // loop around them, if 1 image does not have the data-type then ok, however if 2 or more does not have the data-type then reload the images.
      // also if the data-type is more then once then reload the images.
      let count = 0;
      thumbnailElements.forEach((thumbnailElement) => {
        if (thumbnailElement.dataset?.tag !== "Freddy Comin' For You") {
          return;
        } else {
          if (count === 1) {
            //remove the image
            thumbnailElement.remove();
            consoleLog(Severity.INFO, "Removed image");
          }
        }
      });
      if (count > 1 || count === 0) {
        thumbnailElement.dataset.tag = "";
      }
    }
  });
};

const start = async () => {
  //console.log("Starting MrBeastify extension");
  //consoleLog(Severity.INFO, "Starting MrBeastify extension");
  consoleLog(Severity.WELCOME);
  await loadImages();

  // in a new thread check if the images has changed, if so then reload the images.
  setInterval(() => {
    quickCheck();
  }, 1000 * 5); // 5 seconds

  const video = new MutationObserver(applyOverlays);
  video.observe(document.body, {
    childList: true,
    subtree: true,
  });

  applyOverlays();
};

start();
