module.exports = {
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(js)$",
  transform: {
    "\\.js$": "babel-jest",
    "\\.vue$": "vue-jest",
  },
}
