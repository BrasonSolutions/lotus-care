import type { Meta, StoryObj } from "@storybook/react";
import HomeModal from "@/components/home-modal";
import { homes } from "@/data/homes";

const meta: Meta<typeof HomeModal> = {
  title: "Modals/HomeModal",
  component: HomeModal,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  args: { onClose: () => {} },
};
export default meta;
type Story = StoryObj<typeof HomeModal>;

export const AmethystHouse: Story = {
  args: { home: homes[0] },
};

export const BerylHouse: Story = {
  args: { home: homes[1] },
};

export const CitrineHouse: Story = {
  args: { home: homes[2] },
};

export const DiamondHouse: Story = {
  args: { home: homes[3] },
};
