import React, { useEffect, useState } from "react";
import { Button, Input, Select, Upload, List, Typography, Flex } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { addImageToStorage, loadImages, removeItem } from "../../utils/utils";

const { Option } = Select;
const ImagesSettings: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");

  const [newImage, setNewImage] = useState<{
    name?: string;
    tags?: string[];
    locations: string[];
    url: string;
  }>({ name: "", tags: [], locations: ["global"], url: "" });

  const handleNameChange = (value: string) => {
    setNewImage({ ...newImage, name: value });
  };

  const handleTagsChange = (value: string[]) => {
    setNewImage({ ...newImage, tags: value });
  };

  const handleLocationsChange = (value: string[]) => {
    setNewImage({ ...newImage, locations: value });
  };

  const handleUrlChange = (info: any) => {
    // Handle image upload logic
    console.log(info.fileList);
    setNewImage({ ...newImage, url: info.fileList[0]?.url });
  };

  const handleAddImage = async () => {
    await addImageToStorage(imageUrl);

    setImages([
      ...images,
      { ...newImage, id: Math.floor(Math.random() * 1000000), url: imageUrl },
    ]);
    setNewImage({} as any);
  };

  useEffect(() => {
    const getData = async () => {
      const images = await loadImages();

      setImages(images);
    };

    getData();
  }, []);

  return (
    <div>
      <Typography.Title level={3}>Images Settings</Typography.Title>
      <Flex vertical={true} gap={"middle"}>
        <div>
          <label>Name (optional):</label>
          <Input onChange={(e) => handleNameChange(e.target.value)} />
        </div>
        <div>
          <label>Tags (optional):</label>
          <Select
            mode="tags"
            style={{ width: "100%" }}
            placeholder="Enter tags"
            onChange={(value) => handleTagsChange(value)}
          />
        </div>
        <div>
          <label>Locations:</label>
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Select locations"
            onChange={(value) => handleLocationsChange(value)}
            allowClear={true}
            defaultValue={["Global"]}
          >
            <Option value="Global" key={"Global"}>
              Global
            </Option>
            <Option value="Youtube">YouTube</Option>
            <Option value="Twitch">Twitch</Option>
            {/* Add more options based on your requirements */}
          </Select>
        </div>
        <Flex gap={"middle"} justify="space-between" vertical={false}>
          <Input
            placeholder="A image url"
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <Upload
            beforeUpload={() => false}
            onChange={handleUrlChange}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Flex>
        <Button type="primary" onClick={handleAddImage}>
          Add Image
        </Button>
      </Flex>
      <div>
        <Typography.Title level={4}>View Added Images</Typography.Title>
        <List
          dataSource={images}
          renderItem={(image) => (
            <List.Item>
              <img
                src={image.url || chrome.runtime.getURL("images/" + image.file)}
                alt={image.name || "Image"}
                style={{ maxWidth: "100px", marginRight: "16px" }}
              />
              <Flex>
                <Typography.Text>Name: {image.name || "N/A"}</Typography.Text>
                <br />
                <Typography.Text>
                  Tags: {image.tags?.join(", ") || "N/A"}
                </Typography.Text>
                <br />
                <Typography.Text>
                  Locations:{" "}
                  {image.locations ? image.locations.join(", ") : "Global"}
                </Typography.Text>
              </Flex>

              <Flex vertical>
                <Button
                  danger
                  onClick={() => {
                    removeItem(image.id);
                    setImages(images.filter((i) => i.id != image.id));
                  }}
                >
                  Remove
                </Button>
              </Flex>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default ImagesSettings;
