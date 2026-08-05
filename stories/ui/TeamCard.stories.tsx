import type { Meta, StoryObj } from "@storybook/react";
import { TeamCard } from "@/components/team-card";
import { teamMembers } from "@/data/team";

const meta: Meta<typeof TeamCard> = {
  title: "UI/TeamCard",
  component: TeamCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: { onClick: () => {} },
  argTypes: {
    accent: { control: "radio", options: ["teal", "purple"] },
  },
};
export default meta;
type Story = StoryObj<typeof TeamCard>;

// Mary Bardin — has an image; bio (if any) lives in TeamModal, not the card.
export const Default: Story = {
  args: { member: teamMembers[0], accent: "teal" },
};

// Vaida Cheema — purple accent, exercises the alternation.
export const PurpleAccent: Story = {
  args: { member: teamMembers[10], accent: "purple" },
};

// No `image` on the member — must fall back to the initials gradient.
export const NoPhoto: Story = {
  name: "No Photo (Initials Fallback)",
  args: { member: { ...teamMembers[0], image: undefined }, accent: "teal" },
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 max-w-4xl">
      {teamMembers.slice(0, 6).map((member, i) => (
        <TeamCard
          key={member.name}
          member={member}
          onClick={() => {}}
          accent={i % 2 === 0 ? "teal" : "purple"}
        />
      ))}
    </div>
  ),
};
