module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['src', 'test'],
  moduleNameMapper: {
    '~(.*)': '<rootDir>/src$1',
  },
}
