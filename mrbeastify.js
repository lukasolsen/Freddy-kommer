const getRandomImage = () => {
  console.log("Getting random image");
  const folder = "images/";

  // get a random image from the images folder
  const images = ["1.png", "2.png", "3.png", "4.png", "5.png"];

  const numImages = images.length;
  const randomIndex = Math.floor(Math.random() * numImages);
  console.log("Random index: " + randomIndex);
  return folder + images[randomIndex];
};

const getImageURL = (path) => {
  console.log("Getting image URL");
  return chrome.runtime.getURL(path);
};

// Apply the overlay
function applyOverlay(thumbnailElement, overlayImageURL, flip = false) {
  if (thumbnailElement.nodeName == "IMG") {
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
    thumbnailElement.parentElement.appendChild(overlayImage);
  } else if (thumbnailElement.nodeName == "DIV") {
    thumbnailElement.style.backgroundImage =
      `url("${overlayImageURL}"), ` + thumbnailElement.style.backgroundImage;
  }
}

const applyOverlays = () => {
  console.log("Applying overlays");
  const elementQueryThumbnail =
    "ytd-thumbnail:not(.ytd-video-preview, .ytd-rich-grid-slim-media) a > yt-image > img.yt-core-image:only-child:not(.yt-core-attributed-string__image-element),.ytp-videowall-still-image:not([style*='extension:'])";
  const thumbnailElements = document.querySelectorAll(elementQueryThumbnail);

  thumbnailElements.forEach((thumbnailElement) => {
    const randomImage = getRandomImage();

    const overlayImageURL = getImageURL(randomImage);
    applyOverlay(thumbnailElement, overlayImageURL);
  });
};

const start = () => {
  console.log("Starting MrBeastify extension");
  setInterval(applyOverlays, 100);
};

start();
