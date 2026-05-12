import type { Meta, StoryObj } from "@storybook/react";
import AboutSection from "@/components/about-section";

const meta: Meta<typeof AboutSection> = {
  title: "Sections/AboutSection",
  component: AboutSection,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof AboutSection>;

export const Default: Story = {};
