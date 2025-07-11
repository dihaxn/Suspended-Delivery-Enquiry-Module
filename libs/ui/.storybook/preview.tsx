import { Theme, ThemePanel } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import type { Preview } from '@storybook/react';
import { FC } from 'react';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export const decorators = [
  (Story: FC) => {
    return (
      <Theme>
        <Story />
        <ThemePanel defaultOpen={false} />
      </Theme>
    );
  },
];

export default preview;

// import '../src/lib/styles/global.css'; // Importing global styles
// // import './styles.css'; // Importing Tailwind CSS styles
// import '@radix-ui/themes/styles.css';

// // Optionally, you can add decorators or parameters here if needed
// export const parameters = {
//   actions: { argTypesRegex: '^on[A-Z].*' },
//   controls: { expanded: true },
// };
