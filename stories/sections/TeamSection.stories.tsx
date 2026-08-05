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

// Services department only (2 members) — partial row in the 3-col grid, accent alternation visible.
export const FilteredSubset: Story = {
  name: "Filtered Subset (Partial Row)",
  args: {
    members: teamMembers.filter((m) => m.department === "Services"),
  },
};

// Alan Doyle + Claire Maher have bio: "" in src/data/team.ts — cards no longer render bio at
// all, so this proves uniform card height comes from structure, not from an empty-string guard.
export const MembersWithNoBioData: Story = {
  name: "Members With No Bio Data (Uniform Height)",
  args: {
    members: teamMembers.filter((m) => m.bio === ""),
  },
};
