import { Severity, consoleLog } from "../styles/styles";

document.onload = function () {
  const container = document.getElementById("container");
  const addButton = document.getElementById("addButton");
  const removeButton = document.getElementById("removeButton");

  // Get all the images from images.json
  const imageFileURL = chrome.runtime.getURL("/images.json");
  //console.log("Loading images from " + imageFileURL);
  consoleLog(Severity.INFO, "Loading images from " + imageFileURL);

  const images: Image[] = [];

  fetch(imageFileURL)
    .then((response) => response.json())
    .then((json: Image[]) => {
      images.push(...json);
    });

  addButton.addEventListener("click", () => {
    // Go into the images file, then add a new image to the images.json file
    // Then, refresh the page

    
  });
};
