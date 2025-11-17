/** @type {import('jest').Config} */
  const config = {//Config is an inetrface provided by jest to tell us how we will test our ts files using jest
  preset: 'ts-jest',                    // Specifies that we are using ts-jest for TypeScript
  testEnvironment: 'node',              // Specifies the test environment (e.g., jsdom or node)
       roots: ['<rootDir>/src/tests'], // Specifies the root directory for Jest to look for test files
  testMatch: ['**/*.test.ts'],// in the main folder, look for tests folder and any ts files inside it
  testPathIgnorePatterns: ["/node_modules/"],//ignore node modules folder when looking for tests
  verbose: true,                        // shows detauled results of tests
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'], // js will collect coverage from all ts files in src folder
  collectCoverage: true,                // Enables code coverage collection
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'text-summary'],
  // Specifies the directory to output coverage files
  coverageThreshold: {                  // Sets the minimum coverage percentages your code must have.
    // If coverage is lower, Jest will fail the test run
    global: {
      functions: 75,
      statements: 70
    }
  }
};
module.exports = config;

