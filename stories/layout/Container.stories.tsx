import type { Meta, StoryObj } from "@storybook/react";
import { Container } from "@/components/layout";

const meta: Meta<typeof Container> = {
  title: "Layout/Container",
  component: Container,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Container>;

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
      <Container>
        <p className="py-6 text-sm text-muted">
          This section is capped at <code>max-w-wide</code> (90rem / 1440px) with responsive
          gutters. Used for heroes, galleries, infographics, and 50/50 media rows.
        </p>
      </Container>
    </Boundary>
  ),
};

export const Nested: Story = {
  render: () => (
    <Boundary>
      <Container>
        <div className="py-6">
          <p className="text-sm text-muted mb-4">
            The wide container can hold media at full width, with a narrower reading measure
            nested inside for body copy.
          </p>
          <Container width="reading">
            <p className="text-foreground leading-relaxed">
              This paragraph sits inside a <code>Container width=&quot;reading&quot;</code>{" "}
              nested inside the wide <code>Container</code> above — capped at ~65ch so long-form
              copy stays comfortable to read regardless of how wide the enclosing section is.
            </p>
          </Container>
        </div>
      </Container>
    </Boundary>
  ),
};

export const Reading: Story = {
  render: () => (
    <div className="bg-warm-bg py-8">
      <Container
        width="reading"
        padded
        className="bg-white outline outline-dashed outline-primary/50 py-6"
      >
        <p className="text-foreground leading-relaxed">
          Long-form body copy stays capped at <code>max-w-prose</code> (~65ch) for comfortable
          line length, regardless of how wide its parent section is. Use <code>padded</code> when
          this container is used standalone, at the top level of a section — leave it off when
          nesting inside a wide <code>Container</code> that already supplies gutters.
        </p>
      </Container>
    </div>
  ),
};
