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

    port.onMessage.addListener((content) => {
      console.log("Message received", content);
      console.log("Message received data", content.data);
      console.log("Message received message", content.data.message);
      if (content.data.message === "getImages") {
        console.log("getImages message received");
        getImages().then((images) => {
          console.log("Sending response Images", images);
          port.postMessage({ data: images, id: content.id });
        });
      } else if (
        content.data.message === "login" &&
        content.data.username &&
        content.data.password
      ) {
        postLogin(content.data.username, content.data.password).then(
          (response) => {
            console.log("Sending response", response);
            port.postMessage({ data: response, id: content.id });
          }
        );
      } else if (
        content.data.message === "register" &&
        content.data.username &&
        content.data.password &&
        content.data.email
      ) {
        postRegister(
          content.data.username,
          content.data.password,
          content.data.email
        ).then((response) => {
          console.log("Sending response", response);
          port.postMessage({ data: response, id: content.id });
        });
      } else if (content.data.message === "isLoggedIn") {
        getStorage("jwt").then((jwt) => {
          console.log("Sending response isLoggedIn", !!jwt);
          port.postMessage({ data: !!jwt, id: content.id });
        });
      }
    });
  }
}

const connection = new Connection();

const getStorage = async (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, (result) => {
      resolve(result[key]);
    });
  });
};

const setStorage = async (key, value) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [key]: value }, () => {
      resolve({ [key]: value });
    });
  });
};

const getImages = async () => {
  try {
    console.log("Fetching images");
    const response = await fetch("http://localhost:5000/api/v2/images", {
      headers: {
        Authorization: `Bearer ${await getStorage("jwt")}`,
      },
    });
    if (response.ok) {
      //as json
      const json = await response.json();
      console.log("Images fetched", json);

      return json;
    } else {
      throw new Error("Failed to fetch images");
    }
  } catch (error) {
    console.error(error);
    return [];
  }
};

const postLogin = async (username, password) => {
  try {
    console.log("Logging in");
    const response = await fetch("http://localhost:5000/api/v2/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (response.ok) {
      //as json
      const json = await response.json();
      console.log("Login successful", json);

      if (json.jwt) {
        await setStorage("jwt", json.jwt);
      }

      return json;
    } else {
      throw new Error("Failed to login");
    }
  } catch (error) {
    console.error(error);
    return [];
  }
};

const postRegister = async (username, password, email) => {
  try {
    console.log("Registering");
    const response = await fetch("http://localhost:5000/api/v2/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, email }),
    });
    if (response.ok) {
      //as json
      const json = await response.json();
      console.log("Register successful", json);

      if (json.jwt) {
        await setStorage("jwt", json.jwt);
      }

      return json;
    } else {
      throw new Error("Failed to register");
    }
  } catch (error) {
    console.error(error);
    return [];
  }
};
