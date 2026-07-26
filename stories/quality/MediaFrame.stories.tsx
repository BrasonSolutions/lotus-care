import type { Meta, StoryObj } from "@storybook/react";
import { MediaFrame } from "@/components/quality/media-frame";

const meta: Meta<typeof MediaFrame> = {
  title: "Quality/MediaFrame",
  component: MediaFrame,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof MediaFrame>;

export const Placeholder: Story = {
  args: {
    caption: "A closer look at life at Lotus Care.",
  },
};

export const WithVideo: Story = {
  args: {
    videoSrc: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    poster: undefined,
  },
};
