import type { Meta, StoryObj } from "@storybook/react";
import { TeamSection } from "@/components/team-section";
import { teamMembers, departments } from "@/data/team";

const meta: Meta<typeof TeamSection> = {
  title: "Sections/TeamSection",
  component: TeamSection,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  args: {
    members: teamMembers,
    departments,
  },
};
export default meta;
type Story = StoryObj<typeof TeamSection>;

export const Default: Story = {};
