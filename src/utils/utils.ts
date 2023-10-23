import { Severity, consoleLog } from "../styles/styles";

const getRandomImage = (images: Image[]): string => {
  const folder = "images/";

  const numImages = images.length;
  const randomIndex = Math.floor(Math.random() * numImages);

  return (
    images[randomIndex]?.url ??
    chrome.runtime.getURL(folder + images[randomIndex]?.file)
  );
};

const checkImages = (images: Image[]): Image[] => {
  const supportedExtensions = ["jpg", "jpeg", "png", "gif"];

  images.forEach((image) => {
    const path = image?.file ?? image?.url;
    const fileExtension = path?.split(".").pop()?.toLowerCase();
    if (!supportedExtensions.includes(fileExtension)) {
      consoleLog(
        Severity.WARNING,
        "Image " + path + " is not a supported image file"
      );
      // TODO: Remove the image from the array
      images.splice(images.indexOf(image), 1);
    }
  });
  return images;
};

export { getRandomImage, checkImages };
