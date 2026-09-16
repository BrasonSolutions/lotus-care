import type { Meta, StoryObj } from "@storybook/react";
import { TestimonialCard } from "@/components/careers/testimonial-card";
import { testimonials } from "@/data/careers";
import { modelOfCareTestimonials } from "@/data/testimonial";

const meta: Meta<typeof TestimonialCard> = {
  title: "Careers/TestimonialCard",
  component: TestimonialCard,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof TestimonialCard>;

// Has a photo — the avatar circle always shows it regardless of `anonymized`.
export const WithPhoto: Story = {
  name: "With photo",
  args: { testimonial: modelOfCareTestimonials[0] },
};

// No photo, but a real name behind it — person-icon avatar, name + role byline.
export const WithoutPhoto: Story = {
  name: "Without photo (named)",
  args: { testimonial: testimonials[0] },
};

// No photo and `anonymized: true` (a survey comment, no individual behind
// it) — person-icon avatar, role shown as the title, no byline underneath.
export const Anonymized: Story = {
  name: "Without photo (anonymised)",
  args: { testimonial: modelOfCareTestimonials[1] },
};
