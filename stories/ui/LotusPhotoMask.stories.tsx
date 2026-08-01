import type { Meta, StoryObj } from "@storybook/react";
import Image from "next/image";
import { LotusPhotoMask } from "@/components/lotus-mark";

const meta: Meta<typeof LotusPhotoMask> = {
  title: "UI/LotusPhotoMask",
  component: LotusPhotoMask,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof LotusPhotoMask>;

export const Default: Story = {
  render: () => (
    <LotusPhotoMask className="w-48 h-48">
      <Image
        src="/images/staff/Danny-Scally.png"
        alt="Danny Scally"
        fill
        className="object-cover object-top"
      />
    </LotusPhotoMask>
  ),
};

export const InitialsFallback: Story = {
  name: "Fallback (no photo)",
  render: () => (
    <LotusPhotoMask className="w-48 h-48 bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white text-4xl font-bold">
      DS
    </LotusPhotoMask>
  ),
};
