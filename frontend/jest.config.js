import { defaultsESM } from "ts-jest/presets";

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  ...defaultsESM,
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testMatch: [
    "**/__tests__/**/*.test.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],
  testPathIgnorePatterns: ["/node_modules/", "/e2e/"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  watchPathIgnorePatterns: ["node_modules", "dist"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(svg)$": "<rootDir>/src/tests/__mocks__/fileMock.js",
  },
};

export default config;
