module.exports = {
  maxWorkers: 1,
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  setupFiles: ["dotenv/config"],
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  moduleFileExtensions: ["ts", "js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
