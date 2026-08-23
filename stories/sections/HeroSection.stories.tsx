import type { Meta, StoryObj } from "@storybook/react";
import { HeroSection } from "@/components/hero-section";

const meta: Meta<typeof HeroSection> = {
  title: "Sections/HeroSection",
  component: HeroSection,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  args: {
    title: "Enhanced living",
    titleHighlight: "empowering lives.",
    subtitle:
      "Providing quality respite and residential disability care services across the Midlands, supporting individuals to live their best lives with dignity and purpose.",
    primaryCtaLabel: "Our Services",
    primaryCtaHref: "#services",
    secondaryCtaLabel: "Careers",
    secondaryCtaHref: "/careers",
  },
};
export default meta;
type Story = StoryObj<typeof HeroSection>;

export const Default: Story = {};
