import type { Meta, StoryObj } from "@storybook/react";
import { CircularCycle } from "@/components/quality/circular-cycle";
import { humanRightsFramework, qualitySafetyCycle } from "@/data/quality";

const meta: Meta<typeof CircularCycle> = {
  title: "Quality/CircularCycle",
  component: CircularCycle,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof CircularCycle>;

export const HumanRights: Story = {
  args: {
    steps: humanRightsFramework,
    centerLabel: "Human Rights Framework",
  },
};

export const QualitySafety: Story = {
  args: {
    steps: qualitySafetyCycle,
    centerLabel: "Continuous Improvement",
  },
};
