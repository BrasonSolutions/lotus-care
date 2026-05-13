import type { Meta, StoryObj } from "@storybook/react";
import { BoardSection } from "@/components/board-section";

const meta: Meta<typeof BoardSection> = {
  title: "Sections/BoardSection",
  component: BoardSection,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof BoardSection>;

export const Default: Story = {};
