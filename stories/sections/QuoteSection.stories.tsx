import type { Meta, StoryObj } from "@storybook/react";
import { QuoteSection } from "@/components/quote-section";
import { homeQuote } from "@/data/testimonial";

const meta: Meta<typeof QuoteSection> = {
  title: "Sections/QuoteSection",
  component: QuoteSection,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof QuoteSection>;

export const Teal: Story = {
  args: { quote: homeQuote },
};
