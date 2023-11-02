import { Severity, consoleLog } from "../styles/styles";

const imageFileURL = chrome.runtime.getURL("images.json");

export const getImagesFromJSON = async () => {
  const images: Image[] = [];
  await fetch(imageFileURL)
    .then((response) => response.json())
    .then((json: Image[]) => {
      images.push(...json);
    });
  return images;
};

export const getImagesFromStorage = async () => {
  return new Promise<Image[]>((resolve, reject) => {
    chrome.storage.local.get("images", (result) => {
      resolve(result.images);
    });
  });
};

export const reloadImages = async () => {
  const images = [];

  const imagesFromJSON = await getImagesFromJSON();
  images.push(...imagesFromJSON);

  const imagesFromStorage = await getImagesFromStorage();
  images.push(...imagesFromStorage);

  return images;
};

export const removeItem = async (id: number) => {
  // Remove the image from the json, then reload the website
  const images = await getImagesFromStorage();

  if (!images) {
    return;
  }
  const filteredImages = images.filter((image) => image.id !== id);
  chrome.storage.local.set({ images: filteredImages }, () => {
    consoleLog(Severity.INFO, "Removed image " + id);
  });
};

export const addImage = (image: Image) => {
  let url = image.url;
  if (image.file) {
    url = chrome.runtime.getURL("images/" + image.file);
  }

  const container = document.getElementById("collection");

  const mainDiv = document.createElement("div");

  const imageElement = document.createElement("img");
  imageElement.src = url;

  const actions = document.createElement("div");
  actions.className = "actions";

  const remove = document.createElement("button");
  remove.className = "remove";
  remove.setAttribute("data-id", image.id.toString());
  remove.innerText = "Remove";
  remove.addEventListener("click", async () => {
    const id = parseInt(remove.getAttribute("data-id"));

    await removeItem(id);
    let images = [];
    removeAllDisplayedImages();
    await reloadImages().then((allImages) => {
      images = [...allImages];
    });

    images.forEach((image) => {
      addImage(image);
    });
  });

  actions.appendChild(remove);

  mainDiv.appendChild(imageElement);
  mainDiv.appendChild(actions);
  container.appendChild(mainDiv);
};

export const removeAllImages = async () => {
  chrome.storage.local.set({ images: [] }, () => {
    consoleLog(Severity.INFO, "Removed all images");
  });
};

export const removeAllDisplayedImages = () => {
  const container = document.getElementById("collection");
  container.innerHTML = "";
};

export const addImageToStorage = async (imageUrl: string) => {
  // Add an image to the images.json file
  // Refresh the page
  const image = {
    id: Math.floor(Math.random() * 1000000),
    url: imageUrl,
  };
  // Store it locally to chrome storage
  const images = await getImagesFromStorage();

  images.push(image);

  chrome.storage.local.set({ images: images });
};
