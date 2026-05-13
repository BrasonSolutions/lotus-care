import type { Meta, StoryObj } from "@storybook/react";
import { HeroSection } from "@/components/hero-section";

const meta: Meta<typeof HeroSection> = {
  title: "Sections/HeroSection",
  component: HeroSection,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  args: {
    title: "Enhanced Living,",
    titleHighlight: "Empowered Lives",
    subtitle:
      "Providing quality respite and residential disability care services across Victoria, supporting individuals to live their best lives with dignity and purpose.",
  },
};
export default meta;
type Story = StoryObj<typeof HeroSection>;

export const Default: Story = {};
