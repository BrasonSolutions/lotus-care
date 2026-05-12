import type { Meta, StoryObj } from "@storybook/react";
import MobileMenu from "@/components/mobile-menu";

const meta: Meta<typeof MobileMenu> = {
  title: "Navigation/MobileMenu",
  component: MobileMenu,
  parameters: {
    layout: "fullscreen",
    // Render at mobile width — component uses lg:hidden so it's invisible on desktop
    viewport: { defaultViewport: "mobile1" },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof MobileMenu>;

// Transparent nav (hero area)
export const OnDarkBackground: Story = {
  args: { scrolled: false },
  parameters: { backgrounds: { default: "dark" } },
};

// Solid white nav (scrolled)
export const OnWhiteBackground: Story = {
  args: { scrolled: true },
};
