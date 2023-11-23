import { Severity, consoleLog } from "../styles/styles";
import { getRandomImage } from "../utils/utils";
import { YOUTUBE_SHORTS_QUERY, YOUTUBE_VIDEO_QUERY } from "../env/paths";

class Youtube {
  private images: Image[];

  constructor(images: Image[]) {
    console.log("Youtube loader");
    this.images = images;
  }

  private createOverlayImage(
    overlayImageURL: string,
    flip: boolean
  ): HTMLImageElement {
    const overlayImage = new Image();
    overlayImage.src = overlayImageURL;
    overlayImage.style.position = "absolute";
    overlayImage.style.top = "0";
    overlayImage.style.left = "0";
    overlayImage.style.width = "100%";
    overlayImage.style.height = "100%";
    overlayImage.style.zIndex = "0";
    overlayImage.style.pointerEvents = "none";
    overlayImage.style.objectFit = "cover";

    if (flip) {
      overlayImage.style.transform = "scaleX(-1)";
    }

    return overlayImage;
  }

  private applyOverlay(
    thumbnailElement: HTMLElement,
    overlayImageURL: string,
    flip: boolean
  ): void {
    if (thumbnailElement.nodeName === "IMG") {
      const overlayImage = this.createOverlayImage(overlayImageURL, flip);
      thumbnailElement.style.position = "relative";

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

  private identifyVideos(): HTMLElement[] {
    const thumbnailElements: NodeListOf<HTMLElement> =
      document.querySelectorAll(
        `${YOUTUBE_VIDEO_QUERY}, ${YOUTUBE_SHORTS_QUERY}`
      );

    return Array.from(thumbnailElements);
  }

  private applyOverlays(): void {
    consoleLog(Severity.INFO, "Applying overlays");

    const thumbnailElements = this.identifyVideos();
    for (const thumbnailElement of thumbnailElements) {
      if (thumbnailElement.dataset?.tag === "Freddy Comin' For You") {
        continue;
      }

      const randomImage = getRandomImage(this.images);
      this.applyOverlay(thumbnailElement, randomImage, false);
    }
  }

  private checker(): void {
    const thumbnailElements = this.identifyVideos();

    for (const thumbnailElement of thumbnailElements) {
      if (thumbnailElement.dataset?.tag !== "Freddy Comin' For You") {
        continue;
      }

      const freddyImages = thumbnailElements.filter(
        (el) => el.dataset?.tag === "Freddy Comin' For You"
      );

      if (freddyImages.length === 1) {
        freddyImages[0].remove();
        consoleLog(Severity.INFO, "Removed image");
      } else {
        thumbnailElement.dataset.tag = "";
      }
    }
  }

  public run(): void {
    this.applyOverlays();

    setInterval(() => {
      this.checker();
    }, 1000 * 5);

    const video = new MutationObserver(() => {
      this.applyOverlays();
    });

    video.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}

export default Youtube;
