import { Severity, consoleLog } from "../styles/styles";
import { getRandomImage, getSetting } from "../utils/utils";
import { YOUTUBE_SHORTS_QUERY, YOUTUBE_VIDEO_QUERY } from "../constants";

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

  private reaction = () => {
    // Check if the current url is a youtube video
    // If it is then apply a abselute div with an image

    if (window.location.href.includes("youtube.com/watch")) {
      console.log(
        document.querySelector(".html5-video-container")?.children?.length
      );
      if (
        document.querySelector(".html5-video-container")?.children?.length > 1
      ) {
        return;
      }

      console.log(
        document.querySelector('[data-tag="Reaction-Video-Present"]')
      );

      // Check if a reaction video is already there. If it is just return, if not then continue.
      if (document.querySelector('[data-tag="Reaction-Video-Present"]')) {
        return;
      }

      // Apply overlay
      const randomImage = getRandomImage(this.images);
      console.log(randomImage);
      const elem = document.createElement("div");
      elem.style.position = "absolute";
      elem.style.top = "0";
      elem.style.left = "0";
      elem.style.zIndex = "1000000000";
      elem.style.width = "25%";
      elem.setAttribute("data-tag", "Reaction-Video-Present");

      const img = document.createElement("img");
      img.src = randomImage;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      img.style.pointerEvents = "none";
      elem.appendChild(img);

      document.querySelector(".html5-video-container").appendChild(elem);
    }
  };

  public run(): void {
    getSetting("youtube", "enabled").then((enabled) => {
      if (!enabled) {
        return;
      }

      getSetting("youtube", "replaceThumbnails").then((replaceThumbnails) => {
        if (replaceThumbnails) {
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
      });

      getSetting("youtube", "reactionVideo").then((reactionVideo) => {
        if (reactionVideo) {
          this.reaction();
          const video = new MutationObserver(() => {
            this.reaction();
          });
          video.observe(document.body, {
            childList: true,
            subtree: true,
          });
        }
      });
    });
  }
}

export default Youtube;
