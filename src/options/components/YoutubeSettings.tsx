import { useState } from "react";
import { Switch, InputNumber, Upload, Button, Typography, Badge } from "antd";
import { UploadOutlined } from "@ant-design/icons";

interface NewFeatureBadgeProps {
  isNew: boolean;
}

const NewFeatureBadge: React.FC<NewFeatureBadgeProps> = ({ isNew }) => {
  return isNew ? <Badge status="success" title="NEW" text={"NEW"} /> : null;
};

const YoutubeSettings: React.FC = () => {
  const [replaceThumbnails, setReplaceThumbnails] = useState(false);
  const [reactionVideo, setReactionVideo] = useState(false);
  const [thumbnailCheckFrequency, setThumbnailCheckFrequency] = useState(24); // in hours
  const [reactionVideoDuration, setReactionVideoDuration] = useState(30); // in seconds

  const handleThumbnailCheckFrequencyChange = (value: number | undefined) => {
    if (value !== undefined) {
      setThumbnailCheckFrequency(value);
    }
  };

  const handleReactionVideoDurationChange = (value: number | undefined) => {
    if (value !== undefined) {
      setReactionVideoDuration(value);
    }
  };

  const handleThumbnailUpload = (info: any) => {
    // Handle thumbnail upload logic
    console.log(info.fileList);
  };

  return (
    <div>
      <Typography.Title level={3}>YouTube Settings</Typography.Title>
      <div style={{ marginBottom: "16px" }}>
        <label>Replace Thumbnails:</label>
        <Switch
          checked={replaceThumbnails}
          onChange={(checked) => setReplaceThumbnails(checked)}
        />
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label>
          Reaction Video:
          <NewFeatureBadge isNew={true} />
        </label>
        <Switch
          checked={reactionVideo}
          onChange={(checked) => setReactionVideo(checked)}
        />
        {reactionVideo && (
          <div>
            <label>Reaction Video Duration (seconds):</label>
            <InputNumber
              min={1}
              value={reactionVideoDuration}
              onChange={handleReactionVideoDurationChange}
            />
          </div>
        )}
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label>Check for new thumbnails every:</label>
        <InputNumber
          min={1}
          max={24 * 7} // 7 days
          value={thumbnailCheckFrequency}
          onChange={handleThumbnailCheckFrequencyChange}
        />
        <span> hours</span>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label>Custom Thumbnail:</label>
        <Upload
          beforeUpload={() => false}
          onChange={handleThumbnailUpload}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </div>
    </div>
  );
};

export default YoutubeSettings;
