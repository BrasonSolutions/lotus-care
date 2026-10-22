import type { Meta, StoryObj } from "@storybook/react";
import { RecruitmentSection, RecruitmentRoles } from "@/components/recruitment-section";
import { JobCardSkeletons } from "@/components/careers/job-card/JobCardSkeletons";
import { normalise } from "@/lib/occupop";
import fixture from "@/lib/__fixtures__/occupop-jobs.json";

// Real Occupop API response, normalised the same way the homepage does it —
// lets the live-roles cards be reviewed without an OCCUPOP_API_TOKEN. On the
// site the `roles` slot is <HomeRoles /> inside Suspense; here it is filled directly.
const jobs = (fixture.data as Parameters<typeof normalise>[0][]).map(normalise);

const meta: Meta<typeof RecruitmentSection> = {
  title: "Sections/RecruitmentSection",
  component: RecruitmentSection,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  args: {
    roles: <RecruitmentRoles jobs={jobs} />,
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
export const LoadError: Story = { args: { roles: <RecruitmentRoles jobs={null} /> } };

/** Occupop returned no live roles. */
export const NoOpenRoles: Story = { args: { roles: <RecruitmentRoles jobs={[]} /> } };

/** Placeholder cards shown while Occupop is still answering. */
export const Loading: Story = {
  args: { roles: <JobCardSkeletons count={3} className="grid grid-cols-1 md:grid-cols-3 gap-5" /> },
};
