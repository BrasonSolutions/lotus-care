import type { Meta, StoryObj } from "@storybook/react";
import { TeamSection } from "@/components/team-section";

const meta: Meta<typeof TeamSection> = {
  title: "Sections/TeamSection",
  component: TeamSection,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof TeamSection>;

export const Default: Story = {};
