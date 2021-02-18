module.exports = {
  roots: [
    '<rootDir>/src',
  ],
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
  },
  testEnvironment: 'node',
  testRegex: '.spec.tsx?$',
  moduleDirectories: ["node_modules", "."],
  setupFiles: [
    '<rootDir>/jest.setupTests.js',
  ],
}
