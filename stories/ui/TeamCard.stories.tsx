import type { Meta, StoryObj } from "@storybook/react";
import { TeamCard } from "@/components/team-card";
import { teamMembers } from "@/data/team";

const meta: Meta<typeof TeamCard> = {
  title: "UI/TeamCard",
  component: TeamCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: { onClick: () => {} },
};
export default meta;
type Story = StoryObj<typeof TeamCard>;

export const Default: Story = {
  args: { member: teamMembers[0] },
};

export const ClinicalMember: Story = {
  args: { member: teamMembers[2] },
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4 max-w-3xl">
      {teamMembers.slice(0, 8).map((member) => (
        <TeamCard key={member.name} member={member} onClick={() => {}} />
      ))}
    </div>
  ),
};
