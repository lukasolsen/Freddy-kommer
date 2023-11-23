import {
  getRandomImage,
  checkImages,
  loadImages,
  getCurrentTab,
} from "./utils/utils";
import { consoleLog, Severity } from "./styles/styles";

import Youtube from "./loaders/Youtube";

let images: Image[] = [];



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
