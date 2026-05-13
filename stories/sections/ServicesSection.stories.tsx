import type { Meta, StoryObj } from "@storybook/react";
import { ServicesSection } from "@/components/services-section";
import { services } from "@/data/services";

const meta: Meta<typeof ServicesSection> = {
  title: "Sections/ServicesSection",
  component: ServicesSection,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  args: {
    services,
  },
};
export default meta;
type Story = StoryObj<typeof ServicesSection>;

export const Default: Story = {};
