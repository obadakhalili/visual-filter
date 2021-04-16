module.exports = {
  testRegex: "(/__tests__/.*|(\\.|/)(spec))\\.(ts)$",
  transform: {
    "\\.ts$": "ts-jest",
    "\\.js$": "babel-jest",
  },
}
