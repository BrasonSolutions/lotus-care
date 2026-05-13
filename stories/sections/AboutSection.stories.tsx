import type { Meta, StoryObj } from "@storybook/react";
import { AboutSection } from "@/components/about-section";

const meta: Meta<typeof AboutSection> = {
  title: "Sections/AboutSection",
  component: AboutSection,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  args: {
    title: "About Lotus Care",
    subtitle: "Dedicated to enhancing the lives of people with disabilities since our founding.",
    paragraphs: [
      "Lotus Care is a registered NDIS provider committed to delivering exceptional residential and respite disability care across Victoria. Our network of eight purpose-designed homes provides warm, supportive environments where individuals are empowered to thrive.",
      "We believe every person deserves to live a life of dignity, choice, and connection. Our dedicated team of professionals works alongside each participant to develop personalised support plans that reflect their unique goals, interests, and aspirations.",
      "Through our person-centred approach, multi-disciplinary expertise, and genuine commitment to community integration, we create pathways for individuals to build meaningful relationships, develop new skills, and participate fully in community life.",
    ],
    stats: [
      { value: "8", label: "Care Homes" },
      { value: "150+", label: "Staff Members" },
      { value: "200+", label: "Lives Supported" },
      { value: "24/7", label: "Care Available" },
    ],
  },
};
export default meta;
type Story = StoryObj<typeof AboutSection>;

export const Default: Story = {};
