import type { Meta, StoryObj } from "@storybook/react";
import { Timeline } from "@/components/timeline";

const meta: Meta<typeof Timeline> = {
  title: "UI/Timeline",
  component: Timeline,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "radio", options: ["horizontal", "vertical"] },
  },
};
export default meta;
type Story = StoryObj<typeof Timeline>;

const pathwaySteps = [
  { number: "1", title: "Support Worker", description: "Entry-level direct care with full induction and mandatory training." },
  { number: "2", title: "Senior Support Worker", description: "Increased responsibility, mentoring junior staff, specialised training pathways." },
  { number: "3", title: "Social Care Leader / PIC", description: "Leading a home, managing a team, regulatory compliance responsibility." },
  { number: "4", title: "Senior Services Manager", description: "Oversight of multiple homes, strategic planning, operational leadership." },
];

const hiringSteps = [
  { number: 1, title: "Apply", description: "Submit your CV and cover letter through our online application form." },
  { number: 2, title: "Screening Call", description: "A short call to talk through your experience and what you're looking for." },
  { number: 3, title: "Interview", description: "Meet the team and discuss the role in more depth." },
  { number: 4, title: "Offer", description: "A formal offer, subject to pre-employment checks." },
  { number: 5, title: "Pre-Employment Checks", description: "Reference, Garda vetting, and right-to-work checks." },
  { number: 6, title: "Start", description: "Induction and onboarding with your new team." },
];

export const Vertical: Story = {
  args: { steps: pathwaySteps, orientation: "vertical" },
};

export const Horizontal: Story = {
  args: { steps: hiringSteps, orientation: "horizontal" },
  parameters: {
    docs: {
      description: {
        story:
          "Below the `md` breakpoint (768px) this collapses to the same vertical layout as the `Vertical` story — resize the canvas/browser to see it.",
      },
    },
  },
};
