module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.spec.ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  // roots: ["<rootDir>/tests"],
  coverageDirectory: "reports/coverage",
};
