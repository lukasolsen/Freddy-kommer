import { useEffect, useState } from "react";
import { Switch, InputNumber, Upload, Button, Typography, Badge } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { changeSettings, getSetting } from "../../utils/utils";

interface NewFeatureBadgeProps {
  isNew: boolean;
}

const NewFeatureBadge: React.FC<NewFeatureBadgeProps> = ({ isNew }) => {
  return isNew ? <Badge status="success" title="NEW" text={"NEW"} /> : null;
};

const YoutubeSettings: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [replaceThumbnails, setReplaceThumbnails] = useState(false);
  const [reactionVideo, setReactionVideo] = useState(false);

  useEffect(() => {
    const getData = async () => {
      getSetting("youtube", "enabled").then((value: boolean) => {
        console.log(value);
        setEnabled(value);
      });

      getSetting("youtube", "replaceThumbnails").then((value: boolean) => {
        setReplaceThumbnails(value);
      });

      getSetting("youtube", "reactionVideo").then((value: boolean) => {
        setReactionVideo(value);
      });
    };

    getData();
  }, []);

  return (
    <div>
      <Typography.Title level={3}>YouTube Settings</Typography.Title>
      {/* enabled.. */}
      <div style={{ marginBottom: "16px" }}>
        <label>Enabled</label>
        <Switch
          checked={enabled}
          onChange={(checked) => {
            console.log(checked);
            setEnabled(checked);
            changeSettings("youtube", "enabled", checked);
          }}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label>Replace Thumbnails:</label>
        <Switch
          checked={replaceThumbnails}
          onChange={(checked) => {
            setReplaceThumbnails(checked);
            changeSettings("youtube", "replaceThumbnails", checked);
          }}
        />
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label>
          Reaction Video:
          <NewFeatureBadge isNew={true} />
        </label>
        <Switch
          checked={reactionVideo}
          onChange={(checked) => {
            setReactionVideo(checked);
            changeSettings("youtube", "reactionVideo", checked);
          }}
        />
      </div>
    </div>
  );
};

export default YoutubeSettings;
