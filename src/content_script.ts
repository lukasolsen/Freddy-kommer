type Image = {
  id: number;
  name?: string;
  description?: string;
  date?: string;
  file?: string;
  url?: string;
};

let images: Image[] = [];
const loadedImages: { [url: string]: HTMLImageElement } = {};

const loadImages = async () => {
  const imageFileURL = chrome.runtime.getURL("/images.json");
  console.log("Loading images from " + imageFileURL);

  await fetch(imageFileURL)
    .then((response) => response.json())
    .then((json: Image[]) => {
      console.log("Loaded images");
      console.log(json);
      images = json;
    });
};

const loadImage = async (image: Image): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      loadedImages[image?.url ?? image?.file ?? ""] = img;
      resolve();
    };
    img.src = image?.url ?? image?.file ?? "";
    img.onerror = reject;
  });
};

const preloadImages = async () => {
  const imageLoadPromises: Promise<void>[] = images.map(loadImage);
  try {
    await Promise.all(imageLoadPromises);
  } catch (error) {
    console.error("Error loading images: ", error);
  }
};

const getRandomImage = (): string => {
  console.log("Getting random image");
  const folder = "images/";

  const numImages = images.length;
  const randomIndex = Math.floor(Math.random() * numImages);
  console.log("Random index: " + randomIndex);
  return (
    images[randomIndex]?.url ??
    chrome.runtime.getURL("images/" + images[randomIndex]?.file)
  );
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
  console.log("Applying overlays");
  const thumbnailElements = identifyVideos();
  thumbnailElements.forEach((thumbnailElement) => {
    const randomImage = getRandomImage();
    applyOverlay(thumbnailElement, randomImage);
  });
};

const identifyVideos = () => {
  const elementQueryThumbnail =
    "ytd-thumbnail:not(.ytd-video-preview, .ytd-rich-grid-slim-media) a > yt-image > img.yt-core-image:only-child:not(.yt-core-attributed-string__image-element),.ytp-videowall-still-image:not([style*='extension:'])";

  const thumbnailElements: NodeListOf<HTMLElement> = document.querySelectorAll(
    elementQueryThumbnail
  );
  return thumbnailElements;
};

const start = async () => {
  console.log("Starting MrBeastify extension");
  await loadImages();
  await preloadImages();

  const observer = new MutationObserver(applyOverlays);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  applyOverlays();
};

start();
