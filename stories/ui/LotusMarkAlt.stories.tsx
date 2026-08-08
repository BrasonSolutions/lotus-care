import type { Meta, StoryObj } from "@storybook/react";
import { LotusMarkAlt } from "@/components/lotus-mark";

const meta: Meta<typeof LotusMarkAlt> = {
  title: "UI/LotusMarkAlt",
  component: LotusMarkAlt,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof LotusMarkAlt>;

export const Default: Story = {
  args: { className: "w-64 h-64 text-primary-dark" },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-8">
      {(["w-16 h-16", "w-32 h-32", "w-64 h-64"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <LotusMarkAlt className={`${size} text-primary-dark`} />
          <span className="text-xs text-muted">{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const LowOpacityOnLight: Story = {
  name: "Low opacity — behind hero copy (light surface)",
  render: () => (
    <div className="relative overflow-hidden bg-white p-12 max-w-lg rounded-2xl">
      <LotusMarkAlt className="absolute -right-12 -bottom-16 w-80 h-80 text-primary-dark opacity-5 pointer-events-none" />
      <div className="relative">
        <h3 className="text-xl font-bold text-primary-dark mb-3">Enhanced Living, Empowered Lives</h3>
        <p className="text-foreground leading-relaxed">
          At 5% opacity behind hero copy, the mark reads as texture, not
          content — headline and body text stay comfortably above WCAG AA.
        </p>
      </div>
    </div>
  ),
};

export const LowOpacityOnBrandSurface: Story = {
  name: "Low opacity — behind hero copy (brand surface, as used in CareersHero)",
  render: () => (
    <div className="relative overflow-hidden bg-primary-dark p-12 max-w-lg rounded-2xl">
      <LotusMarkAlt className="absolute -right-12 -bottom-16 w-80 h-80 text-white opacity-[0.06] pointer-events-none" />
      <div className="relative">
        <h3 className="text-xl font-bold text-white mb-3">Our Story</h3>
        <p className="text-white/80 leading-relaxed">
          Same pattern as `LotusMark` in `CareersHero`: `currentColor` +
          `opacity-[0.06]` on a brand-coloured surface, positioned entirely
          via `className`.
        </p>
      </div>
    </div>
  ),
};
