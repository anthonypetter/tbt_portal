/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "@generated/(.*)": "<rootDir>/src/schema/__generated__/$1",
    "@utils/(.*)": "<rootDir>/src/utils/$1",
    "@lib/(.*)": "<rootDir>/src/lib/$1",
    "@schema/(.*)": "<rootDir>/src/schema/$1",
    "@services/(.*)": "<rootDir>/src/services/$1",
  },
};
