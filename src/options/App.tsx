import { useState } from "react";
import { Layout, Menu, Switch, Typography, Badge, MenuItemProps } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  YoutubeOutlined,
  TrophyOutlined,
  TwitterOutlined,
  SettingOutlined,
  GithubOutlined,
  InstagramOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import YoutubeSettings from "./components/YoutubeSettings";
import { FaImage } from "react-icons/fa";
import ImagesSettings from "./components/ImageSettings";

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [maintenance, setMaintenance] = useState(false);

  const [selectedMenu, setSelectedMenu] = useState("youtube");

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const toggleMaintenance = () => {
    setMaintenance(!maintenance);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          <Typography.Title
            level={3}
            style={{ color: "#fff", margin: "16px 10px" }}
          >
            Funify
          </Typography.Title>
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["youtube"]}>
          <Menu.Item
            key="youtube"
            onClick={() => setSelectedMenu("youtube")}
            icon={<YoutubeOutlined />}
            defaultChecked
          >
            YouTube
          </Menu.Item>
          <Menu.Item
            key="twitch"
            onClick={() => setSelectedMenu("twitch")}
            icon={<TrophyOutlined />}
          >
            Twitch
          </Menu.Item>
          <Menu.Item
            key="twitter"
            onClick={() => setSelectedMenu("twitter")}
            icon={<TwitterOutlined />}
          >
            Twitter
          </Menu.Item>
          <Menu.Item
            key="settings"
            onClick={() => setSelectedMenu("settings")}
            icon={<SettingOutlined />}
          >
            Settings
          </Menu.Item>
          <Menu.Item
            key="github"
            onClick={() => setSelectedMenu("github")}
            icon={<GithubOutlined />}
          >
            GitHub
          </Menu.Item>
          <Menu.Item
            key="instagram"
            onClick={() => setSelectedMenu("instagram")}
            icon={<InstagramOutlined />}
          >
            Instagram
          </Menu.Item>
          <Menu.Item
            key="images"
            onClick={() => setSelectedMenu("images")}
            icon={<CameraOutlined />}
          >
            Images
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {collapsed ? (
            <MenuUnfoldOutlined onClick={toggleCollapsed} />
          ) : (
            <MenuFoldOutlined onClick={toggleCollapsed} />
          )}
          {/*<Switch
            style={{ marginLeft: "16px" }}
            checked={!maintenance}
            onChange={toggleMaintenance}
          />
          <Badge
            style={{ marginLeft: "8px" }}
            status={maintenance ? "error" : "success"}
            text={maintenance ? "Under Maintenance" : "Live"}
          />*/}
        </Header>
        <Content style={{ margin: "16px" }}>
          {selectedMenu === "youtube" && <YoutubeSettings />}
          {selectedMenu === "twitch" && <div>Twitch</div>}
          {selectedMenu === "twitter" && <div>Twitter</div>}
          {selectedMenu === "settings" && <div>Settings</div>}
          {selectedMenu === "github" && <div>GitHub</div>}
          {selectedMenu === "instagram" && <div>Instagram</div>}
          {selectedMenu === "images" && <ImagesSettings />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
