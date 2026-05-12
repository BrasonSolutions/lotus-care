import type { Meta, StoryObj } from "@storybook/react";
import TeamModal from "@/components/team-modal";
import { teamMembers, boardMembers } from "@/data/team";

const meta: Meta<typeof TeamModal> = {
  title: "Modals/TeamModal",
  component: TeamModal,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  args: { onClose: () => {} },
};
export default meta;
type Story = StoryObj<typeof TeamModal>;

export const LeadershipMember: Story = {
  args: { member: teamMembers[0] },
};

export const ClinicalMember: Story = {
  args: { member: teamMembers[2] },
};

export const BoardMember: Story = {
  args: { member: boardMembers[0] },
};
