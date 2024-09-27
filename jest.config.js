module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests/'],
  setupFiles: ['<rootDir>/tests/setup.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/init.ts'],
  testTimeout: 120000,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!**/node_modules/**'],
}
