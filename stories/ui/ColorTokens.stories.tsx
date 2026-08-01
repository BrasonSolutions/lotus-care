import type { Meta, StoryObj } from "@storybook/react";

const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

const SCALE_HEX: Record<string, Record<number, string>> = {
  teal: {
    50: "#eef9fb",
    100: "#d4f1f5",
    200: "#aae3eb",
    300: "#7fd5e0",
    400: "#54c7d6",
    500: "#1badb2",
    600: "#148c91",
    700: "#0d6a70",
    800: "#094a4e",
    900: "#073538",
  },
  purple: {
    50: "#f5dee9",
    100: "#eec5d9",
    200: "#e29dc0",
    300: "#d573a5",
    400: "#c94a8a",
    500: "#97205c",
    600: "#761948",
    700: "#551234",
    800: "#350b21",
    900: "#220715",
  },
  neutral: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
};

const ALIASES: { name: string; resolvesTo: string }[] = [
  { name: "primary-dark", resolvesTo: "teal-700" },
  { name: "primary", resolvesTo: "teal-500" },
  { name: "accent", resolvesTo: "teal-400" },
  { name: "muted", resolvesTo: "neutral-500" },
  { name: "warm-bg", resolvesTo: "#f8f6f3" },
  { name: "foreground", resolvesTo: "#2d3436" },
  { name: "background", resolvesTo: "#ffffff" },
];

function Swatch({ varName, hex }: { varName: string; hex: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className="h-14 w-full rounded-lg border border-gray-100"
        style={{ background: `var(${varName})` }}
      />
      <span className="text-xs font-mono text-foreground">{varName}</span>
      <span className="text-xs font-mono text-muted">{hex}</span>
    </div>
  );
}

function ScaleSection({ scale, note }: { scale: keyof typeof SCALE_HEX; note?: string }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-3">
        <h3 className="text-lg font-bold text-primary-dark capitalize">{scale}</h3>
        {note && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
            {note}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {SCALE_STEPS.map((step) => (
          <Swatch
            key={step}
            varName={`--color-${scale}-${step}`}
            hex={SCALE_HEX[scale][step]}
          />
        ))}
      </div>
    </div>
  );
}

function ColorTokensPalette() {
  return (
    <div className="max-w-4xl">
      <ScaleSection scale="teal" />
      <ScaleSection scale="purple" />
      <ScaleSection scale="neutral" />

      <div>
        <h3 className="text-lg font-bold text-primary-dark mb-3">Semantic aliases</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {ALIASES.map((alias) => (
            <div key={alias.name} className="flex flex-col gap-1">
              <div
                className="h-14 w-full rounded-lg border border-gray-100"
                style={{ background: `var(--color-${alias.name})` }}
              />
              <span className="text-xs font-mono text-foreground">--color-{alias.name}</span>
              <span className="text-xs font-mono text-muted">→ {alias.resolvesTo}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const meta: Meta<typeof ColorTokensPalette> = {
  title: "UI/ColorTokens",
  component: ColorTokensPalette,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ColorTokensPalette>;

export const Default: Story = {};
