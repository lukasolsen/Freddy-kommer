let images = [];

type ImageType = {
  id: number;
  name: string;
  file_path: string;
};

class QueueSystem {
  private queue: any[];
  private port: any;
  private messageListeners: { [id: string]: ((message: any) => void)[] } = {};

  constructor() {
    this.queue = [];
    this.port = null;

    this.setupConnection();
    this.listenToMessages();
  }

  setupConnection() {
    this.port = chrome.runtime.connect({ name: "content" });
  }

  public listenToMessages(): any {
    this.port.onMessage.addListener((message: any) => {
      console.log("Message received", message);
      if (message && message.id) {
        console.log("Message received 123", message);
        return message;
      }
    });
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

  private generateId() {
    return Math.floor(Math.random() * 1000000000).toString();
  }

  public addMessageListener(id: string, listener: (message: any) => void) {
    if (!this.messageListeners[id]) {
      this.messageListeners[id] = [];
    }
    this.messageListeners[id].push(listener);
  }

  public removeMessageListener(id: string, listener: (message: any) => void) {
    if (this.messageListeners[id]) {
      this.messageListeners[id] = this.messageListeners[id].filter(
        (l) => l !== listener
      );
    }
  }

  async sendMessage(message: any): Promise<any> {
    const id = this.generateId();
    // Get the queue's first item, and send it to the background script, then wait for a response.
    this.port.postMessage({ data: message, id: id });
    return id;
  }
}

const queueSystem = new QueueSystem();

class TabController {
  private selectedTab: string;

  constructor() {
    this.selectedTab = "home";

    this.checkLogin();
  }

  public checkLogin = async () => {
    const idLogged = await isLoggedIn();
    if (idLogged === false) {
      this.selectedTab = "login";
      document.querySelectorAll(".tab-content").forEach((tabContent) => {
        if (tabContent.id === "login" + "-content") {
          tabContent.classList.remove("hidden");
        } else {
          tabContent.classList.add("hidden");
        }
      });
    } else {
      document.querySelectorAll(".tab-content").forEach((tabContent) => {
        if (tabContent.id === this.selectedTab + "-content") {
          tabContent.classList.remove("hidden");
        } else {
          tabContent.classList.add("hidden");
        }
      });
    }
  };

  public getSelectedTab() {
    return this.selectedTab;
  }

  public setSelectedTab(tab: string) {
    this.selectedTab = tab;

    document.querySelectorAll(".tab-content").forEach((tabContent) => {
      if (tabContent.id === tab + "-content") {
        tabContent.classList.remove("hidden");
      } else {
        tabContent.classList.add("hidden");
      }
    });
  }
}
document.addEventListener("DOMContentLoaded", async () => {
  const tabController = new TabController();

  const login = async (username: string, password: string) => {
    try {
      const id = queueSystem.sendMessage({
        message: "login",
        username,
        password,
      });
      // you get id from sendMessage. Use the lsitener functio nto listen for the responses, then check the id.
      // if the id matches, then do something with the response.
      // if the id does not match, then do nothing.

      const response = await queueSystem.listenToMessages();
      console.log("Response received", response);
      if (response.id === id) {
        console.log("Login response received", response);
        if (response.data.jwt) {
          tabController.setSelectedTab("home");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const register = async (
    username: string,
    password: string,
    email: string
  ) => {
    try {
      const id = queueSystem.sendMessage({
        message: "register",
        username,
        password,
        email,
      });

      const response = await queueSystem.listenToMessages();
      if (response.id === id) {
        console.log("Register response received", response);
        if (response.data.jwt) {
          tabController.setSelectedTab("home");
        }
      }
    } catch (error) {
      console.error("Register error:", error);
    }
  };

  // Handle tab clicks
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((tab) => {
        tab.classList.remove("active");
      });
      tab.classList.add("active");

      tabController.setSelectedTab(tab.id);
    });
  });

  // Check if the user is logged in and update the UI accordingly
  try {
    const data = await isLoggedIn();
    console.log("IsLoggedIn response:", data);

    if (data === true) {
      console.log("User is logged in");
      /*document.getElementById(
        "signed-in"
      ).innerHTML = `<button class="tab" id="logout">
        Logout
        <i class="fa-solid fa-sign-out"></i>
        </button>`;*/

      const response: ImageType[] = await queueSystem.sendMessage({
        message: "getImages",
      });

      console.log("Response received images:", response);
      addContentToList(response);
    } else {
      /*document.getElementById(
        "signed-in"
      ).innerHTML = `<button class="tab" id="login">
        Login
        <i class="fa-solid fa-sign-in"></i>
        </button>`;*/
      console.log("User is not logged in");
    }
  } catch (error) {
    console.error("Error sending or receiving a message:", error);
  }

  document.getElementById("login-button").addEventListener("click", () => {
    const username = (<HTMLInputElement>(
      document.getElementById("login_username")
    )).value;
    const password = (<HTMLInputElement>(
      document.getElementById("login_password")
    )).value;

    login(username, password);
  });

  document.getElementById("register-button").addEventListener("click", () => {
    const username = (<HTMLInputElement>(
      document.getElementById("register_username")
    )).value;
    const password = (<HTMLInputElement>(
      document.getElementById("register_password")
    )).value;
    const email = (<HTMLInputElement>document.getElementById("register_email"))
      .value;

    register(username, password, email);
  });
});

const addContentToList = (images: ImageType[]) => {
  if (images === undefined) return;
  const main = document.getElementById("list");

  images.forEach((image) => {
    console.log(image);
    const item = document.createElement("item");
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");

    const imageElement = document.createElement("img");
    imageElement.src = image.file_path;

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

const isLoggedIn = async () => {
  try {
    const id: any = queueSystem.sendMessage({
      message: "isLoggedIn",
    });

    const response = await queueSystem.listenToMessages();
    console.log("Response received", response);

    if (response?.id === id) {
      console.log("IsLoggedIn response received", response);
      return response.data;
    }
  } catch (error) {
    console.error("Error sending or receiving a message:", error);
  }
};

const uploadImages = async (image: { name: string; file: File }) => {
  try {
    const { name, file } = image;

    // Create a FormData object and append the image file with the specified name
    const formData = new FormData();
    formData.append("image", file);
    // append the image name
    formData.append("name", name);

    const response = await queueSystem.sendMessage({
      message: "uploadImages",
      data: formData, // Send the FormData object with the image
    });

    console.log("Response received", response);
  } catch (error) {
    console.error("Error sending or receiving a message:", error);
  }
};

document.getElementById("imageInput").addEventListener("change", (e) => {
  sendImage(e.target as HTMLInputElement);
});

function sendImage(input: HTMLInputElement) {
  const selectedImage = document.getElementById(
    "selectedImage"
  ) as HTMLImageElement;
  if (input.files && input.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      selectedImage.src = e.target.result as string;
      selectedImage.style.display = "block";
    };

    reader.readAsDataURL(input.files[0]);
  }
}
