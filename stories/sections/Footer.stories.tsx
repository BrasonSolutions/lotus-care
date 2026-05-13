import type { Meta, StoryObj } from "@storybook/react";
import { Footer } from "@/components/footer";
import { contactInfo } from "@/data/navigation";

const quickLinks = [
  { label: "About Us", href: "#about" },
  { label: "Our Services", href: "#services" },
  { label: "Our Homes", href: "#homes" },
  { label: "Meet the Team", href: "#team" },
  { label: "Careers", href: "#careers" },
  { label: "Contact Us", href: "#contact" },
];

const serviceNames = [
  "Community Residential Living",
  "Residential Respite Care",
  "MDT Pathways",
  "Model of Care",
  "Person Centred Planning",
  "Community Integration",
];

const meta: Meta<typeof Footer> = {
  title: "Sections/Footer",
  component: Footer,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  args: {
    contactInfo,
    quickLinks,
    serviceNames,
  },
};
export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {};
