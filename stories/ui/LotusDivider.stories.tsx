import type { Meta, StoryObj } from "@storybook/react";
import { LotusDivider } from "@/components/ui/LotusDivider";

const meta: Meta<typeof LotusDivider> = {
  title: "UI/LotusDivider",
  component: LotusDivider,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  argTypes: {
    tone: { control: "radio", options: ["light", "dark"] },
  },
};
export default meta;
type Story = StoryObj<typeof LotusDivider>;

export const Light: Story = {
  args: { tone: "light" },
};

export const OnWarmBg: Story = {
  name: "On warm-bg",
  render: (args) => (
    <div className="bg-warm-bg">
      <LotusDivider {...args} />
    </div>
  ),
  args: { tone: "light" },
};

export const Dark: Story = {
  name: "Dark (on teal-700 band)",
  render: (args) => (
    <div style={{ background: "var(--color-teal-700)" }}>
      <LotusDivider {...args} />
    </div>
  ),
  args: { tone: "dark" },
};
