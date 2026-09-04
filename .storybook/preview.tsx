import type { Preview, Decorator } from "@storybook/react";
import { useEffect } from "react";
import "../src/app/globals.css";

// Forces reveals to show immediately — components use useReveal which starts
// at opacity:0 and animates in on scroll. Pop is left alone deliberately: the
// staggered infographic stories are demonstrating that stagger.
const FORCED_EFFECTS = '[data-reveal-effect="rise"], [data-reveal-effect="scale"], [data-reveal-effect="fade"]';

const ForceInViewDecorator: Decorator = (Story) => {
  useEffect(() => {
    document.querySelectorAll(FORCED_EFFECTS).forEach((el) => {
      el.classList.add("in-view");
    });
  });
  return <Story />;
};

const preview: Preview = {
  decorators: [ForceInViewDecorator],
  parameters: {
    layout: "fullscreen",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: { appDirectory: true },
  },
};

export default preview;
