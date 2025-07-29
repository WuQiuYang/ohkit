import { addons } from '@storybook/manager-api';
import { themes } from '@storybook/theming';

addons.setConfig({
  theme: {
    ...themes.light,
    brandTitle: 'Ohkit Storybook',
    brandUrl: '/',
    brandImage: require('../public/ohkit.svg'),
    brandTarget: '_self',
  },
  sidebar: {
    showRoots: true,
  },
});