import type { Meta, StoryObj } from "@storybook/react";
import SectionTitle from "@/components/section-title";

const meta: Meta<typeof SectionTitle> = {
  title: "UI/SectionTitle",
  component: SectionTitle,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof SectionTitle>;

export const Default: Story = {
  args: {
    title: "Our Services",
    subtitle: "Comprehensive disability support services designed around each individual's needs.",
  },
};

export const WithoutSubtitle: Story = {
  args: { title: "Meet the Team" },
};

export const LightVariant: Story = {
  args: {
    title: "Our Board",
    subtitle: "Experienced leaders guiding Lotus Care's strategic direction.",
    light: true,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
