import type { Meta, StoryObj } from "@storybook/react";
import { BoardSection } from "@/components/board-section";
import { boardMembers } from "@/data/team";

const meta: Meta<typeof BoardSection> = {
  title: "Sections/BoardSection",
  component: BoardSection,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  args: {
    members: boardMembers,
  },
};
export default meta;
type Story = StoryObj<typeof BoardSection>;

export const Default: Story = {};
