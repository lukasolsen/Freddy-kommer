let images = [];

class TabController {
  private selectedTab: string;

  constructor() {
    this.selectedTab = "marketplace";
  }

  public getSelectedTab() {
    return this.selectedTab;
  }

  public setSelectedTab(tab: string) {
    this.selectedTab = tab;
  }
}

class QueueSystem {
  private queue: any[];
  private port: any;

  constructor() {
    this.queue = [];
    this.port = null;

    this.setupConnection();
  }

  setupConnection() {
    this.port = chrome.runtime.connect({ name: "content" });
  }

  public addToQueue(item: any) {
    this.queue.push(item);
  }

  public removeFromQueue(item: any) {
    this.queue = this.queue.filter((queueItem) => queueItem !== item);
  }

  public getQueue() {
    return this.queue;
  }

  async sendMessage(message: any) {
    //Get the queue's first item, and send it to the background script, then wait for response, once we gotten something, delete it from queue and continue.
    this.port.postMessage(message);

    return new Promise((resolve, reject) => {
      this.port.onMessage.addListener((message: any) => {
        if (message) {
          //this.removeFromQueue(this.queue[0]);
          resolve(message);
        } else {
          reject("Error");
        }
      });
    });
  }
}

const queueSystem = new QueueSystem();

document.querySelectorAll(".tab").forEach((tab) => {
  console.log("Tab found");
  tab.addEventListener("click", () => {
    console.log("Tab clicked");
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.classList.remove("active");
    });
    tab.classList.add("active");
    const tabController = new TabController();
    tabController.setSelectedTab(tab.id);
    console.log(tabController.getSelectedTab());
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response: any = await queueSystem.sendMessage({
      message: "getImages",
    });

    console.log("Response received", response);
    addContentToList(response?.images);
  } catch (error) {
    console.error("Error sending or receiving a message:", error);
  }
});

const addContentToList = (images: []) => {
  const main = document.getElementById("list");

  images.forEach((image) => {
    const item = document.createElement("item");
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");

    const imageElement = document.createElement("img");
    imageElement.src = image;

    const footerItems = document.createElement("div");
    footerItems.classList.add("item-footer");

    const addButton = document.createElement("button");
    addButton.classList.add("button");
    addButton.innerText = "Add";

    const downloadButton = document.createElement("button");
    downloadButton.classList.add("button");
    downloadButton.innerText = "Download";

    footerItems.appendChild(addButton);
    footerItems.appendChild(downloadButton);

    itemDiv.appendChild(imageElement);
    itemDiv.appendChild(footerItems);

    item.appendChild(itemDiv);
    main.appendChild(item);
  });
};
