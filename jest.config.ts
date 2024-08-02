module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '@shared': '<rootDir>/src/shared/$1',
    '@application/services/(.*)': '<rootDir>/src/application/services/$1',
    '@application/controllers/transaction/':
      '<rootDir>/src/application/controllers/transaction/$1',
    '@application/DTOs/(.*)': '<rootDir>/src/application/DTOs/$1',
    '@application/(.*)': '<rootDir>/src/application/$1',
    '@domain': '<rootDir>/src/domain/$1',
    '@db': '<rootDir>/src/db/$1',
    '@repositories': '<rootDir>/src/repositories/$1',
    '@config': '<rootDir>/src/config/$1',
  },
};
