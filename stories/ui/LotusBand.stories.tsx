import type { Meta, StoryObj } from "@storybook/react";
import { LotusBand } from "@/components/lotus-band";

const meta: Meta<typeof LotusBand> = {
  title: "UI/LotusBand",
  component: LotusBand,
  // Full-bleed component — "fullscreen" (not "centered") so the story
  // canvas shows the true edge-to-edge tiling, same as Container.stories.tsx.
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "radio", options: ["teal", "purple", "neutral"] },
  },
};
export default meta;
type Story = StoryObj<typeof LotusBand>;

export const Teal: Story = {
  args: { variant: "teal" },
};

export const Purple: Story = {
  args: { variant: "purple" },
};

export const NeutralSpacer: Story = {
  name: "Neutral spacer (no motif)",
  args: { variant: "neutral" },
};

export const WithOverlayText: Story = {
  name: "With overlaid text (AA contrast demo)",
  render: () => (
    <LotusBand variant="purple" height={140} className="flex items-center">
      <div className="px-8 sm:px-12">
        <h3 className="text-2xl font-bold">Enhanced Living, Empowered Lives</h3>
      </div>
    </LotusBand>
  ),
};

// F5's 6 shape-divider colourways — same component, band colour × motif
// colour as two independent props (see LotusBand.tsx's `motifColor` doc).
const DIVIDERS = [
  { variant: "teal", motifColor: "white" },
  { variant: "teal", motifColor: "black" },
  { variant: "teal", motifColor: "purple" },
  { variant: "purple", motifColor: "teal" },
  { variant: "purple", motifColor: "black" },
  { variant: "purple", motifColor: "white" },
] as const;

export const AllSixDividers: Story = {
  name: "All 6 divider colourways (F5)",
  render: () => (
    <div className="flex flex-col gap-2">
      {DIVIDERS.map(({ variant, motifColor }) => (
        <LotusBand key={`${variant}-${motifColor}`} variant={variant} motifColor={motifColor} height={72} />
      ))}
    </div>
  ),
};
