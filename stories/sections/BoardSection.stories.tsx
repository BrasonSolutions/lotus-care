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

// One member with no `image` — proves the initials fallback still reads
// correctly under the lotus clip-path mask, not just the photo case.
export const NoPhotoFallback: Story = {
  name: "No Photo (Initials Fallback)",
  args: {
    members: boardMembers.map((member, i) =>
      i === 0 ? { ...member, image: undefined } : member
    ),
  },
};
