import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/stores/(.*)$': '<rootDir>/src/stores/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};

export default config;
