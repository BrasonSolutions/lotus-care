import type { Meta, StoryObj } from "@storybook/react";
import { ReadingContainer } from "@/components/layout";

const meta: Meta<typeof ReadingContainer> = {
  title: "Layout/ReadingContainer",
  component: ReadingContainer,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ReadingContainer>;

export const Default: Story = {
  render: () => (
    <div className="bg-warm-bg py-8">
      <ReadingContainer padded className="bg-white outline outline-dashed outline-primary/50 py-6">
        <p className="text-foreground leading-relaxed">
          Long-form body copy stays capped at <code>max-w-prose</code> (~65ch) for comfortable
          line length, regardless of how wide its parent section is. Use <code>padded</code> when
          this container is used standalone, at the top level of a section — leave it off when
          nesting inside a <code>WideContainer</code> that already supplies gutters.
        </p>
      </ReadingContainer>
    </div>
  ),
};
