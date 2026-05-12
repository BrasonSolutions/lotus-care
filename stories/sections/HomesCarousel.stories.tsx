import type { Meta, StoryObj } from "@storybook/react";
import HomesCarousel from "@/components/homes-carousel";

const meta: Meta<typeof HomesCarousel> = {
  title: "Sections/HomesCarousel",
  component: HomesCarousel,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof HomesCarousel>;

export const Default: Story = {};
