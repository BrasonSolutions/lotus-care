import type { Meta, StoryObj } from "@storybook/react";
import { RecruitmentSection } from "@/components/recruitment-section";

const meta: Meta<typeof RecruitmentSection> = {
  title: "Sections/RecruitmentSection",
  component: RecruitmentSection,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof RecruitmentSection>;

export const Default: Story = {};
