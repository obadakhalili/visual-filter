module.exports = {
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(ts)$",
  transform: {
    "\\.js$": "babel-jest",
    "\\.ts$": "ts-jest",
    "\\.vue$": "vue-jest",
  },
}
