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

const loadImages = async (): Promise<Image[]> => {
  const images: Image[] = [];

  const response = await fetch(chrome.runtime.getURL("/images.json"));
  const json = await response.json();

  json.forEach((image: Image) => {
    images.push(image);
  });

  await new Promise((resolve) => {
    chrome.storage.local.get("images", (result) => {
      consoleLog(Severity.INFO, "Loaded images from chrome storage", result);
      result.images.map((image: Image) => {
        images.push(image);
      });
      resolve(images);
    });
  });

  return images;
};

const addImageToStorage = async (imageUrl: string) => {
  // Add an image to the images.json file
  // Refresh the page
  const image: Image = {
    id: Math.floor(Math.random() * 1000000),
    locations: ["Global"],
    date: new Date().toISOString(),
    url: imageUrl,
  };
  // Store it locally to chrome storage
  const images = await getImagesFromStorage();

  images.push(image);

  chrome.storage.local.set({ images: images });
};

const getImagesFromStorage = async () => {
  return new Promise<Image[]>((resolve, reject) => {
    chrome.storage.local.get("images", (result) => {
      resolve(result?.images || []);
    });
  });
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

const addStorageValue = async (key: string, value: any) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ key: value }, () => {
      resolve("Added value to storage");
    });
  });
};

const getStorageValue = async (key: string) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, (result) => {
      resolve(result);
    });
  });
};

const getCurrentTab = async () => {
  return window.location.href;
};

export {
  getRandomImage,
  checkImages,
  loadImages,
  addImageToStorage,
  getImagesFromStorage,
  addStorageValue,
  getStorageValue,
  getCurrentTab,
};
