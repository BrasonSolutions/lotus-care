import type { Preview, Decorator } from "@storybook/react";
import { useEffect } from "react";
import "../src/app/globals.css";

// Forces .reveal elements to show immediately — components use useInView
// which starts at opacity:0 and animates in on scroll. In Storybook we
// want them visible right away.
const ForceInViewDecorator: Decorator = (Story) => {
  useEffect(() => {
    document.querySelectorAll(".reveal").forEach((el) => {
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
