import type { Meta, StoryObj } from "@storybook/react";
import { Blob } from "@/components/blob";

const meta: Meta<typeof Blob> = {
  title: "UI/Blob",
  component: Blob,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    color: { control: "radio", options: ["teal", "purple"] },
    variant: { control: "radio", options: [1, 2, 3] },
    opacity: { control: { type: "range", min: 0, max: 1, step: 0.02 } },
  },
};
export default meta;
type Story = StoryObj<typeof Blob>;

export const Default: Story = {
  args: { color: "teal", variant: 1, opacity: 0.5, className: "w-64 h-64" },
};

export const AllVariants: Story = {
  name: "All variants × colors",
  render: () => (
    <div className="grid grid-cols-3 gap-8 bg-warm-bg p-8">
      {([1, 2, 3] as const).map((variant) =>
        (["teal", "purple"] as const).map((color) => (
          <div key={`${variant}-${color}`} className="flex flex-col items-center gap-2">
            <Blob color={color} variant={variant} opacity={0.8} className="w-32 h-32" />
            <span className="text-xs text-muted">
              variant {variant} / {color}
            </span>
          </div>
        ))
      )}
    </div>
  ),
};

export const Animated: Story = {
  args: { color: "purple", variant: 2, opacity: 0.6, animate: true, className: "w-64 h-64" },
};

export const BehindText: Story = {
  name: "Behind text (AA contrast demo)",
  render: () => (
    <div className="relative overflow-hidden bg-white p-12 max-w-lg rounded-2xl">
      <Blob color="teal" variant={1} className="absolute -top-10 -right-10 w-72 h-72" />
      <Blob color="purple" variant={3} className="absolute -bottom-16 -left-16 w-64 h-64" />
      <div className="relative">
        <h3 className="text-xl font-bold text-primary-dark mb-3">Person-Centred Care</h3>
        <p className="text-foreground leading-relaxed">
          At the default opacity (0.12), blobs sit behind body copy without reducing
          contrast below WCAG AA — text stays fully readable regardless of where a
          blob falls behind it.
        </p>
      </div>
    </div>
  ),
};
