module.exports = {
    // The root directory that Jest should use to look for tests and modules.
    rootDir: './',
  
    // The glob patterns Jest should use to find test files.
    testMatch: [
      '**/__tests__/**/*.+(ts)',
      '**/?(*.)+(spec|test).+(ts)'
    ],
  
    // A list of file extensions Jest should look for.
    moduleFileExtensions: ['js', 'ts', 'json'],
  
    // Transform files with a TypeScript preprocessor.
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
  
    // Specify test environment.
    testEnvironment: 'node',
  
    // Mock module dependencies.
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
  
    // Code coverage configuration.
    collectCoverage: true,
    coverageReporters: ['text', 'lcov'],
  };