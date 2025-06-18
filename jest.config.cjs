module.exports = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { useESM: true }],
  },
  transformIgnorePatterns: ["/node_modules/(?!(?:@hookform/resolvers|zod)).*"],
  moduleNameMapper: {
    "^react-router-dom$": "react-router-dom",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
};
