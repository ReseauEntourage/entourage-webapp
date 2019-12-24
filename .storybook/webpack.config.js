const path = require('path')

module.exports = ({ config, mode }) => {
  config.module.rules.push({
    test: /\.tsx?$/,
    use: [
      {
        loader: 'ts-loader',
        options: {
          configFile: `${__dirname}/tsconfig.storybook.json`
        }
      },
      "react-docgen-typescript-loader",
    ]
  }
  )

  config.resolve.extensions.push('.ts', '.tsx');

  config.resolve.modules = [
    ...(config.resolve.modules || []),
    path.resolve('./'),
  ];
  return config;
};
