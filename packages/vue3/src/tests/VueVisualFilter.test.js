import { render } from "@testing-library/vue"
import "@testing-library/jest-dom"
import { GroupType, FilterType } from "@visual-filter/common"

import VueVisualFilter from "@/VueVisualFilter/index.vue"

beforeEach((ctx) => {
  ctx.commonProps = {
    filteringOptions: {
      data: [
        {
          name: "First Name",
          type: "nominal",
          values: ["Foo", "Fizz"],
        },
        {
          name: "Last Name",
          type: "nominal",
          values: ["Bar", "Buzz"],
        },
        {
          name: "Age",
          type: "numeric",
          values: [18, 19],
        },
      ],
      methods: {
        numeric: {
          "="(cellValue, argument) {
            return cellValue == argument
          },
          ">"(cellValue, argument) {
            return cellValue > argument
          },
        },
        nominal: {
          contains(cellValue, argument) {
            return cellValue.includes(argument)
          },
        },
      },
    },
  }
})

test("after initial render we should have group type and filter type selects with correct initial options", ({
  commonProps,
}) => {
  const methods = render(VueVisualFilter, {
    props: commonProps,
  })

  const groupTypeSelect = methods.queryByTestId("group-type-select")

  expect(groupTypeSelect).toBeTruthy()
  expect(groupTypeSelect).toHaveValue(GroupType.AND)

  const filterTypeSelect = methods.queryByTestId("filter-type-select")

  expect(filterTypeSelect).toBeTruthy()
  expect(filterTypeSelect).toHaveValue(FilterType.GROUP)
})
