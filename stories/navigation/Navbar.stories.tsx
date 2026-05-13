import type { Meta, StoryObj } from "@storybook/react";
import { Navbar } from "@/components/navbar";

const meta: Meta<typeof Navbar> = {
  title: "Navigation/Navbar",
  component: Navbar,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Navbar>;

export const Unscrolled: Story = {};

// Gives the canvas enough height to scroll — scrolling triggers the
// white/solid background transition in the navbar.
export const ScrollToRevealSolid: Story = {
  render: () => (
    <div style={{ height: "200vh" }}>
      <Navbar />
      <div className="pt-32 text-center text-muted text-sm">
        Scroll down to see the navbar transition to its solid background state.
      </div>
    </div>
  ),
};
