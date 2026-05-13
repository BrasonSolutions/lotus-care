import type { Meta, StoryObj } from "@storybook/react";
import { RecruitmentSection } from "@/components/recruitment-section";
import { jobs } from "@/data/jobs";

const meta: Meta<typeof RecruitmentSection> = {
  title: "Sections/RecruitmentSection",
  component: RecruitmentSection,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  args: {
    jobs,
    description: [
      "Are you passionate about making a real difference in people's lives? Lotus Care is always looking for compassionate, dedicated professionals to join our growing team.",
    ],
    note: "Competitive salaries, funded training, genuine career progression, and a culture built on respect and inclusion.",
  },
};
export default meta;
type Story = StoryObj<typeof RecruitmentSection>;

export const Default: Story = {};
