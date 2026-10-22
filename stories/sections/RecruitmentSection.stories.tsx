import type { Meta, StoryObj } from "@storybook/react";
import { RecruitmentSection } from "@/components/recruitment-section";
import { normalise } from "@/lib/occupop";
import fixture from "@/lib/__fixtures__/occupop-jobs.json";

// Real Occupop API response, normalised the same way the homepage does it —
// lets the live-roles cards be reviewed without an OCCUPOP_API_TOKEN.
const jobs = (fixture.data as Parameters<typeof normalise>[0][]).map(normalise);

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

/** Occupop fetch failed, or no API token is configured. */
export const LoadError: Story = { args: { jobs: null } };

/** Occupop returned no live roles. */
export const NoOpenRoles: Story = { args: { jobs: [] } };
