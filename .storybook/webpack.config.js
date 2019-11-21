const path = require('path')

module.exports = ({ config, mode }) => {
  config.module.rules.push({
    test: /\.tsx?$/,
    loader: 'ts-loader',
  })

  config.resolve.extensions.push('.ts', '.tsx');

  config.resolve.modules = [
    ...(config.resolve.modules || []),
    path.resolve('./'),
  ];
  return config;
};
