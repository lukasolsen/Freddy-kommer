import { createRoot } from "react-dom/client";
import App from "./App";
import { ConfigProvider, theme } from "antd";

createRoot(document.getElementById("root")).render(
  <ConfigProvider
    theme={{
      algorithm: theme.darkAlgorithm,
      components: {
        Layout: {
          colorBgLayout: "#1D2125",
          siderBg: "#282E33",
          colorText: "#fff",
          headerBg: "#282E33",
          controlItemBgActive: "#1C2B41",
          colorBgContainer: "#1D2125",
          colorPrimaryActive: "#579DFF",
          colorPrimaryBg: "#282E33",
        },
        Typography: {
          colorPrimary: "#fff",
        },
        Menu: {
          colorBgContainer: "#282E33",
          colorText: "#fff",
          colorPrimaryTextActive: "#579DFF",
        },
      },
    }}
  >
    <App />
  </ConfigProvider>
);

document.body.style.margin = "0";
document.body.style.padding = "0";
