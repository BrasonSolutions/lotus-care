import type { Meta, StoryObj } from "@storybook/react";
import { TestimonialPair } from "@/components/quote-section";
import { teamTestimonials } from "@/data/testimonial";

const meta: Meta<typeof TestimonialPair> = {
  title: "Sections/TestimonialPair",
  component: TestimonialPair,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof TestimonialPair>;

export const Purple: Story = {
  args: { testimonials: teamTestimonials },
};
