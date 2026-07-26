import type { Meta, StoryObj } from "@storybook/react";
import { HubAndSpoke } from "@/components/quality/hub-and-spoke";
import { mdtCore, mdtSpokes } from "@/data/quality";

const meta: Meta<typeof HubAndSpoke> = {
  title: "Quality/HubAndSpoke",
  component: HubAndSpoke,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof HubAndSpoke>;

export const MDT: Story = {
  args: {
    core: mdtCore,
    spokes: mdtSpokes,
  },
};
