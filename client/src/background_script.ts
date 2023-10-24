class Connection {
  ports: Set<chrome.runtime.Port>;

  constructor() {
    this.ports = new Set();

    chrome.runtime.onConnect.addListener((port) => {
      this.handleConnection(port);
    });
  }
  public handleConnection(port: chrome.runtime.Port) {
    this.ports.add(port);

    port.onMessage.addListener((message) => {
      console.log("Message received", message);
      if (message.message === "getImages") {
        console.log("getImages message received");
        getImages().then((images) => {
          console.log("Sending response", images);
          port.postMessage({ images });
        });
      }
    });
  }
}

const connection = new Connection();

const getImages = async () => {
  try {
    console.log("Fetching images");
    const response = await fetch("http://localhost:5000/api/v2/images");
    console.log("Response received", response);
    if (response.ok) {
      console.log("Images fetched", response);
      //as json
      const json = await response.json();

      return json;
    } else {
      throw new Error("Failed to fetch images");
    }
  } catch (error) {
    console.error(error);
    return [];
  }
};
