import type { Meta, StoryObj } from "@storybook/react";
import { ContactSection } from "@/components/contact-section";
import { contactInfo } from "@/data/navigation";

const meta: Meta<typeof ContactSection> = {
  title: "Sections/ContactSection",
  component: ContactSection,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  args: {
    contactInfo,
  },
};
export default meta;
type Story = StoryObj<typeof ContactSection>;

export const Default: Story = {};
