const path = require('path')

module.exports = ({ config, mode }) => {
  config.module.rules.push({
    test: /\.tsx?$/,
    loader: 'ts-loader',
    options: {
      configFile: `${__dirname}/tsconfig.storybook.json`
    }
  })

  config.resolve.extensions.push('.ts', '.tsx');

  config.resolve.modules = [
    ...(config.resolve.modules || []),
    path.resolve('./'),
  ];
  return config;
};
