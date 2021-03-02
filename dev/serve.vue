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
              return cellValue.includes(argument)
            },
            startsWith(cellValue, argument) {
              return cellValue.startsWith(argument)
            },
            endsWith(cellValue, argument) {
              return cellValue.endsWith(argument)
            }
          }
        }
      }
    }
  },
  methods: {
    captureFilterUpdate(ctx) {
      // ctx object that contains in-reactive clones of filter, and data objects
      ctx
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
