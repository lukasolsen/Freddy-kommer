export const YOUTUBE_VIDEO_QUERY =
  "ytd-thumbnail:not(.ytd-video-preview, .ytd-rich-grid-slim-media) a > yt-image > img.yt-core-image:only-child:not(.yt-core-attributed-string__image-element),.ytp-videowall-still-image:not([style*='extension:'])";

export const YOUTUBE_SHORTS_QUERY =
  "#contents #content > ytd-rich-grid-slim-media > #dismissible > ytd-thumbnail > a > yt-image > img:only-child:not(.yt-core-attributed-string__image-element)";
