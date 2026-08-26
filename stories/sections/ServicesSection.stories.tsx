import type { Meta, StoryObj } from "@storybook/react";
import { ServicesSection } from "@/components/services-section";
import { services, enhanceServices } from "@/data/services";

const meta: Meta<typeof ServicesSection> = {
  title: "Sections/ServicesSection",
  component: ServicesSection,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  args: {
    groups: [
      {
        title: "Our Services",
        subtitle:
          "Comprehensive disability support services designed around each individual's needs and aspirations.",
        services,
      },
      {
        id: "how-we-enhance",
        title: "How We Enhance Our Services",
        subtitle:
          "The multidisciplinary expertise, model of care and governance that sit behind every service we deliver.",
        services: enhanceServices,
      },
    ],
  },
};
export default meta;
type Story = StoryObj<typeof ServicesSection>;

// P4: also renders the side lotus motif + corner blobs — no new props, so
// the existing render covers it. Petals bloom via a real IntersectionObserver
// (see .storybook/preview.tsx) — scroll the canvas to trigger it.
export const Default: Story = {};
