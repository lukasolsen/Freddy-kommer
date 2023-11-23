import { useEffect, useState } from "react";
import {
  Switch,
  InputNumber,
  Upload,
  Button,
  Typography,
  Badge,
  Flex,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { changeSettings, getSetting } from "../../utils/utils";

interface NewFeatureBadgeProps {
  isNew: boolean;
}

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
      <Flex gap={"middle"} vertical>
        <div>
          <Typography.Text>Enabled</Typography.Text>
          <Switch
            checked={enabled}
            onChange={(checked) => {
              console.log(checked);
              setEnabled(checked);
              changeSettings("youtube", "enabled", checked);
            }}
          />
        </div>

        <div>
          <Typography.Text>Replace Thumbnails:</Typography.Text>
          <Switch
            checked={replaceThumbnails}
            onChange={(checked) => {
              setReplaceThumbnails(checked);
              changeSettings("youtube", "replaceThumbnails", checked);
            }}
          />
        </div>
        <div>
          <Typography.Text>Reaction Video:</Typography.Text>
          <Switch
            checked={reactionVideo}
            onChange={(checked) => {
              setReactionVideo(checked);
              changeSettings("youtube", "reactionVideo", checked);
            }}
          />
        </div>
      </Flex>
    </div>
  );
};

export default YoutubeSettings;
