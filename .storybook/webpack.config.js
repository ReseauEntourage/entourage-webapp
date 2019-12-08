const path = require("path");

module.exports = ({ config, mode }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve("babel-loader"),
    options: {
      presets: [["react-app", { flow: false, typescript: true }]],
      plugins: [
        [
          "styled-components",
          {
            ssr: true,
            displayName: true,
            preprocess: false
          }
        ],
        "@babel/plugin-proposal-optional-chaining"
      ]
    }
  });

  // config.module.rules.push({
  //   test: /\.tsx?$/,
  //   loader: 'ts-loader',
  // })

  config.resolve.extensions.push(".ts", ".tsx");

  config.resolve.modules = [
    ...(config.resolve.modules || []),
    path.resolve("./")
  ];
  return config;
};
