import type { Meta, StoryObj } from "@storybook/react";
import { WideContainer, ReadingContainer } from "@/components/layout";

const meta: Meta<typeof WideContainer> = {
  title: "Layout/WideContainer",
  component: WideContainer,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof WideContainer>;

const Boundary = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-warm-bg py-8">
    <div className="[&>*]:outline [&>*]:outline-dashed [&>*]:outline-primary/50 [&>*]:bg-white">
      {children}
    </div>
  </div>
);

export const Default: Story = {
  render: () => (
    <Boundary>
      <WideContainer>
        <p className="py-6 text-sm text-muted">
          This section is capped at <code>max-w-wide</code> (90rem / 1440px) with responsive
          gutters. Used for heroes, galleries, infographics, and 50/50 media rows.
        </p>
      </WideContainer>
    </Boundary>
  ),
};

export const Nested: Story = {
  render: () => (
    <Boundary>
      <WideContainer>
        <div className="py-6">
          <p className="text-sm text-muted mb-4">
            The wide container can hold media at full width, with a narrower reading measure
            nested inside for body copy.
          </p>
          <ReadingContainer>
            <p className="text-foreground leading-relaxed">
              This paragraph sits inside a <code>ReadingContainer</code> nested inside the{" "}
              <code>WideContainer</code> above — capped at ~65ch so long-form copy stays
              comfortable to read regardless of how wide the enclosing section is.
            </p>
          </ReadingContainer>
        </div>
      </WideContainer>
    </Boundary>
  ),
};
