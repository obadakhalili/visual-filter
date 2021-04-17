# @visual-filter/applyer

A utility for applying a filter to data.

# Usage

```js
const filterApplyer = require("@visual-filter/applyer")

const newData = filterApplyer(
  filter // Provided by @visual-filter/vue2, @visual-filter/vue3, or any other visual filtering component
  methods // Provided by you
  data // Provided by you
)
```

**Note**: That this algorithm operates in-place
