import { createRoot } from "react-dom/client";
import { Severity, consoleLog } from "../styles/styles";
import { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import {
  Button,
  Col,
  ConfigProvider,
  Flex,
  Image,
  Input,
  Layout,
  Row,
  Space,
  Spin,
  Statistic,
  theme,
} from "antd";
import Title from "antd/es/typography/Title";
import { Content, Header } from "antd/es/layout/layout";

const App: React.FC = () => {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Layout>
        {/* Disable button, along with some statistics with flex horizontal at the bottom */}
        <Header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title style={{ color: "#fff" }}>Funify</Title>
          <Button type="primary" onClick={() => {}}>
            Disable
          </Button>
        </Header>
        {/* Content */}
        <Flex style={{ padding: "0 24px", overflowY: "auto" }}>
          {/* Get the current site we're on */}
          {window.location.href.includes("youtube") && (
            <div>
              <Title level={3}>YouTube</Title>
              <Flex gap={"middle"}>
                <Statistic title="Placeholders replaced" value={123} />
                <Statistic title="Images replaced" value={123} />
              </Flex>
            </div>
          )}
        </Flex>
      </Layout>
    </Space>
  );
};

createRoot(document.getElementById("root")).render(
  <ConfigProvider
    theme={{
      algorithm: theme.darkAlgorithm,

      token: {
        colorBgContainer: "#222222",
        colorBgLayout: "#222222",
      },
    }}
  >
    <App />
  </ConfigProvider>
);
