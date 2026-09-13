import type { Meta, StoryObj } from "@storybook/react";
import { CoverflowCarousel } from "@/components/coverflow-carousel";
import { homes } from "@/data/homes";

const meta: Meta<typeof CoverflowCarousel> = {
  title: "UI/CoverflowCarousel",
  component: CoverflowCarousel,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof CoverflowCarousel>;

const slides = homes.flatMap((home) => [
  { src: home.images[0], alt: `${home.name}, exterior` },
  {
    src: home.images.find((src) => src.includes("/interior-1.")) ?? home.images[1],
    alt: `${home.name}, interior`,
  },
]);

export const Default: Story = {
  args: { slides, label: "Photos of our homes" },
};
