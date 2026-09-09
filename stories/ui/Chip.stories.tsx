import type { Meta, StoryObj } from "@storybook/react";
import { Chip } from "@/components/chip";

const meta: Meta<typeof Chip> = {
  title: "UI/Chip",
  component: Chip,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  args: { children: "Full-time", tone: "tealSoft" },
};

export const AllTones: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3 p-6">
      <Chip tone="teal">Teal</Chip>
      <Chip tone="purple">Purple</Chip>
      <Chip tone="tealSoft">Full-time</Chip>
      <Chip tone="accentSoft">Part-time</Chip>
      <Chip tone="neutral">Casual</Chip>
      <Chip tone="solid">Dignity</Chip>
      <Chip tone="solidPurple">Respect</Chip>
    </div>
  ),
};

export const OnDarkTone: Story = {
  parameters: { backgrounds: { default: "dark" } },
  render: () => (
    <div className="bg-primary-dark p-10">
      <Chip tone="onDark">On dark</Chip>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3 p-6">
      <Chip tone="tealSoft" size="sm">
        Small
      </Chip>
      <Chip tone="solid" size="md">
        Medium
      </Chip>
    </div>
  ),
};
