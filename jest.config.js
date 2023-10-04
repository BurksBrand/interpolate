// jest.config.js

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['<rootDir>/src/**/*.spec.ts'],
    collectCoverage: true,
    coverageDirectory: '<rootDir>/coverage',
  };