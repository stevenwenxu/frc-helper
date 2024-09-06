/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "node",
  roots: [
    "src"
  ],
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};
