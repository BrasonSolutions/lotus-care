import type { Meta, StoryObj } from "@storybook/react";
import { LotusMark } from "@/components/lotus-mark";

const meta: Meta<typeof LotusMark> = {
  title: "UI/LotusMark",
  component: LotusMark,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    tone: { control: "radio", options: ["mono", "color"] },
  },
};
export default meta;
type Story = StoryObj<typeof LotusMark>;

export const Mono: Story = {
  args: { className: "w-64 h-64 text-primary-dark" },
};

export const MonoOnDark: Story = {
  name: "Mono (as used in CareersHero)",
  render: (args) => (
    <div className="bg-primary-dark p-12">
      <LotusMark {...args} />
    </div>
  ),
  args: { tone: "mono", className: "w-64 h-64 text-white opacity-50" },
};

export const Color: Story = {
  args: { tone: "color", className: "w-64 h-64" },
};
