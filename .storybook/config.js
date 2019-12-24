import { configure } from '@storybook/react';

configure(require.context('../', true, /\.stories\.(ts|md)x$/), module);
