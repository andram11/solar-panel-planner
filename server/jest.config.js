// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["dotenv/config"],
  testMatch: ["**/tests/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js"],
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "src/utils/dbClient.ts", // Ignore dbClient file
    "src/config/PrismaTransportLog.ts",
    "src/utils/sanitizeInput.ts",
  ],
};
