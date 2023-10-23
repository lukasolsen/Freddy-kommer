const getRandomImage = (images: Image[]): string => {
  const folder = "images/";

  const numImages = images.length;
  const randomIndex = Math.floor(Math.random() * numImages);

  return (
    images[randomIndex]?.url ??
    chrome.runtime.getURL(folder + images[randomIndex]?.file)
  );
};

export { getRandomImage };
