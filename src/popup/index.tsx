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
  theme,
} from "antd";
import Title from "antd/es/typography/Title";
import { Content, Header } from "antd/es/layout/layout";

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);

      try {
        const tImagesFromStorage = await getImagesFromStorage();

        const tImagesFromJSON = await getImagesFromJSON();
        setImages([...tImagesFromStorage, ...tImagesFromJSON]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const getImagesFromJSON = async () => {
    const response = await fetch(chrome.runtime.getURL("images.json"));
    const images = await response.json();
    return images;
  };

  const getImagesFromStorage = () => {
    return new Promise<Image[]>((resolve, reject) => {
      chrome.storage.local.get(["images"], (result) => {
        consoleLog(Severity.INFO, "Got images from storage", result.images);
        const images = result.images as Image[];
        resolve(images);
      });
    });
  };

  const generateImageCredentials = (url: string) => {
    return {
      id: Math.floor(Math.random() * 1000000),
      url: url,
    };
  };

  const removeImage = async (id: number) => {
    setLoading(true);
    const filteredImages = images.filter((image) => {
      consoleLog(Severity.INFO, "Filtering image", image.id, id);
      return image.id != id;
    });

    const storageImages = await getImagesFromStorage();
    const filteredStorageImages = storageImages.filter((image) => {
      consoleLog(Severity.INFO, "Filtering storage image", image.id, id);
      return image.id != id;
    });

    chrome.storage.local.set({ images: filteredStorageImages }, () => {
      consoleLog(Severity.INFO, "Removed image", id);
      consoleLog(Severity.INFO, "Filtered images", filteredImages);

      // Update the images
      setImages(filteredImages);
      setLoading(false);
    });
  };

  const addImage = async (image: Image) => {
    setLoading(true);

    const allImages = [...(await getImagesFromStorage()), image];
    consoleLog(Severity.INFO, "Adding images", allImages);
    chrome.storage.local.set({ images: allImages }, () => {
      consoleLog(Severity.INFO, "Added image", image);

      // Update the images
      setImages((prevImages) => [...prevImages, image]);
      setLoading(false);
    });
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Layout>
        <Header>
          <Title level={2}>Funify</Title>
        </Header>
        <Layout>
          <Content>
            <Flex gap={"middle"}>
              <Input
                placeholder="A image url"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setInput(e.target.value)
                }
                value={input}
                onError={(e) => {}}
                addonAfter={
                  <Button
                    type="text"
                    onClick={() => {
                      consoleLog(Severity.INFO, "Adding image", input);
                      addImage(generateImageCredentials(input));
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaPlus />
                  </Button>
                }
              />
            </Flex>
          </Content>
          {loading && (
            <Content className="loading">
              <Spin size="large" tip="Loading..." />
            </Content>
          )}
          {!loading && images.length === 0 && (
            <Content className="loading">
              <h1>No images found</h1>
            </Content>
          )}

          {!loading && images.length > 0 && (
            <Row
              gutter={[16, 48]}
              className="collection"
              style={{ marginTop: "15px" }}
            >
              {images.map((image) => (
                <Col key={image.id} span={8}>
                  <Image
                    height={"100%"}
                    width={"100%"}
                    style={{
                      objectFit: "cover",
                      borderRadius: "5px",
                    }}
                    preview={false}
                    src={
                      image.url
                        ? image.url
                        : chrome.runtime.getURL("images/" + image.file)
                    }
                  />
                  <Flex gap={"middle"}>
                    <Button
                      className="remove"
                      onClick={() => {
                        removeImage(image.id);
                      }}
                    >
                      <FaTrash /> Remove
                    </Button>
                  </Flex>
                </Col>
              ))}
            </Row>
          )}
        </Layout>
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
