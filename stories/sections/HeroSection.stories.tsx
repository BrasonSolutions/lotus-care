import type { Meta, StoryObj } from "@storybook/react";
import { HeroSection } from "@/components/hero-section";

const meta: Meta<typeof HeroSection> = {
  title: "Sections/HeroSection",
  component: HeroSection,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof HeroSection>;

export const Default: Story = {};
