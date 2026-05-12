import type { Meta, StoryObj } from "@storybook/react";
import LogoWhite from "@/components/logo-white";

const meta: Meta<typeof LogoWhite> = {
  title: "UI/LogoWhite",
  component: LogoWhite,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof LogoWhite>;

export const Default: Story = {
  args: { className: "h-16 w-auto" },
};

export const Large: Story = {
  args: { className: "h-24 w-auto" },
};

export const Small: Story = {
  args: { className: "h-10 w-auto" },
};
