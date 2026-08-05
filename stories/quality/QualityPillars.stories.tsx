import type { Meta, StoryObj } from "@storybook/react";
import { QualityPillars } from "@/components/quality/quality-pillars";
import { hubCards, qualityFoundationPrinciples } from "@/data/quality";

const meta: Meta<typeof QualityPillars> = {
  title: "Quality/QualityPillars",
  component: QualityPillars,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof QualityPillars>;

export const Default: Story = {
  args: {
    pillars: hubCards,
    foundation: qualityFoundationPrinciples,
  },
};
