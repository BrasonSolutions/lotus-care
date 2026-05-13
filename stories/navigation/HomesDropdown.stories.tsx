import type { Meta, StoryObj } from "@storybook/react";
import { HomesDropdown } from "@/components/homes-dropdown";
import { navItems } from "@/data/navigation";

const homesItem = navItems.find((item) => item.children)!;

const meta: Meta<typeof HomesDropdown> = {
  title: "Navigation/HomesDropdown",
  component: HomesDropdown,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: { item: homesItem },
};
export default meta;
type Story = StoryObj<typeof HomesDropdown>;

export const OnDarkBackground: Story = {
  args: { scrolled: false },
  parameters: { backgrounds: { default: "dark" } },
};

export const OnWhiteBackground: Story = {
  args: { scrolled: true },
};
