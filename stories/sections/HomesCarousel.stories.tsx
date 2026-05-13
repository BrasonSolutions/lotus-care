import type { Meta, StoryObj } from "@storybook/react";
import { HomesCarousel } from "@/components/homes-carousel";
import { homes } from "@/data/homes";

const meta: Meta<typeof HomesCarousel> = {
  title: "Sections/HomesCarousel",
  component: HomesCarousel,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  args: {
    homes,
  },
};
export default meta;
type Story = StoryObj<typeof HomesCarousel>;

export const Default: Story = {};
