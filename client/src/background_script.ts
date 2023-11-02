const sendRequestResponse = async (
  requestKey: string,
  req: Promise<unknown>,
  sender,
  variables
) => {
  const url = sender?.tab?.url;
  const [deviceId, res] = await Promise.all(["helloWorld", req]);

  return chrome.tabs.sendMessage(sender?.tab?.id, {
    deviceId,
    url,
    res,
    req: { variables },
    requestKey,
  });
};

const sendBootData = async (_, tab) => {
  await chrome.tabs.sendMessage(tab.id, {
    type: "BOOT_DATA",
    jwt: await getStorage("jwt"),
  });
};

async function handleMessages(message: Record<string, any>, sender) {
  if (message.type === "CHECK_PERMISSIONS") {
    sendBootData("hello world", sender);
    return;
  } else if (message.type === "FETCH_REQUEST") {
    const { requestKey } = message.args.headers || {};

    const req = await fetch(message.url, { ...message.args });

    if (!requestKey) {
      return req;
    }

    return sendRequestResponse(
      requestKey,
      req.json(),
      sender,
      message.args.variables
    );
  }
  return null;
}

chrome.runtime.onMessage.addListener(handleMessages);

const getStorage = (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result[key]);
      }
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
