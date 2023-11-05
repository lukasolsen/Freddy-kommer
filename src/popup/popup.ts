import { Severity, consoleLog } from "../styles/styles";
import {
  addImage,
  addImageToStorage,
  getImagesFromJSON,
  getImagesFromStorage,
  reloadImages,
  removeAllDisplayedImages,
} from "./service";

const addButton = document.getElementById("addButton");

let images: Image[] = [];

getImagesFromJSON().then((res) => {
  images.push(...res);
  res.forEach((image) => {
    addImage(image);
  });
});

getImagesFromStorage().then((res) => {
  images.push(...res);
  res.forEach((image) => {
    addImage(image);
  });
});

if (addButton === null) {
  consoleLog("ERROR", "addButton is null", Severity.ERROR);
} else {
  addButton.addEventListener("click", async () => {
    // add a new image to the json, then reload the website
    const value = document.getElementById("imageInput") as HTMLInputElement;
    // Add the image to the storage
    await addImageToStorage(value.value);
    // Reload all the images from the storage
    removeAllDisplayedImages();
    await reloadImages().then((allImages) => {
      images = [];
      images = [...allImages];
    });

    images.forEach((image) => {
      addImage(image);
    });
  });
}
