import type { Meta, StoryObj } from "@storybook/react";
import { HomesSplitRow } from "@/components/homes-split-row";

const meta: Meta<typeof HomesSplitRow> = {
  title: "Sections/HomesSplitRow",
  component: HomesSplitRow,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof HomesSplitRow>;

export const Default: Story = {};
