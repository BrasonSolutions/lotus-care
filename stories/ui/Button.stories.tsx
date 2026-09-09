import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { children: "Explore All Roles", href: "#", variant: "primary", size: "lg" },
};

export const Outline: Story = {
  args: { children: "Life at Lotus Care", href: "#", variant: "outline", size: "lg" },
};

export const Disabled: Story = {
  args: { children: "Sending…", variant: "primary", size: "lg", disabled: true },
};

export const AllVariantsOnLight: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4 p-6">
      <Button href="#" variant="primary" size="lg">
        Primary
      </Button>
      <Button href="#" variant="outline" size="lg">
        Outline
      </Button>
    </div>
  ),
};

export const AllVariantsOnDark: Story = {
  parameters: { backgrounds: { default: "dark" } },
  render: () => (
    <div className="flex flex-wrap items-center gap-4 bg-primary-dark p-10">
      <Button href="#" variant="onDark" size="lg">
        On dark
      </Button>
      <Button href="#" variant="onDarkOutline" size="lg">
        On dark outline
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4 p-6">
      <Button href="#" size="sm">
        Small
      </Button>
      <Button href="#" size="md">
        Medium
      </Button>
      <Button href="#" size="lg">
        Large
      </Button>
    </div>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <div className="max-w-sm p-6">
      <Button href="#" fullWidth>
        View Role
      </Button>
    </div>
  ),
};

export const AsButtonElement: Story = {
  args: { children: "Close", onClick: () => {} },
};
