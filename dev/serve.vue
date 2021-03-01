<script>
export default {
  name: "ServeDev",
  data() {
    return {
      filteringOptions: {
        data: [
          {
            name: "First Name",
            type: "nominal",
            values: ["Obada", "Ahmad"]
          },
          {
            name: "Last Name",
            type: "nominal",
            values: ["Khalili", "Drhili"]
          },
          {
            name: "Grade",
            type: "numeric",
            values: [3.72, 3.5]
          }
        ],
        methods: {
          numeric: {
            "="(cellValue, argument) {
              return cellValue === argument
            },
            ">"(cellValue, argument) {
              return cellValue > argument
            },
            ">="(cellValue, argument) {
              return cellValue >= argument
            },
            "<"(cellValue, argument) {
              return cellValue < argument
            },
            "<="(cellValue, argument) {
              return cellValue <= argument
            }
          },
          nominal: {
            contains(cellValue, argument) {
              return cellValue.contains(argument)
            },
            endsWith(cellValue, argument) {
              return cellValue.endsWith(argument)
            },
            startsWith(cellValue, argument) {
              return cellValue.startsWith(argument)
            }
          }
        }
      }
    }
  },
  methods: {
    captureFilterUpdate(filter) {
      // Do what ever you want with filter. It's in-reactive
      filter
    }
  }
}
</script>

<template>
  <div id="app">
    <VueVisualFilter
      :filtering-options="filteringOptions"
      @filter-update="captureFilterUpdate"
    ></VueVisualFilter>
  </div>
</template>
