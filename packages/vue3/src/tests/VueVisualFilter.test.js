import { render, fireEvent } from "@testing-library/vue"
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

test("`filteringOptions` prop validator should work as expected", ({
  commonProps,
}) => {
  const filteringOptionsValidator =
    VueVisualFilter.props.filteringOptions.validator

  expect(filteringOptionsValidator(undefined)).toBeFalsy()

  expect(filteringOptionsValidator(null)).toBeFalsy()

  expect(filteringOptionsValidator({})).toBeFalsy()

  expect(filteringOptionsValidator({ data: [] })).toBeFalsy()

  expect(filteringOptionsValidator({ data: [{}] })).toBeFalsy()

  expect(
    filteringOptionsValidator({ data: [{ name: "Firstname" }] }),
  ).toBeFalsy()

  expect(
    filteringOptionsValidator({
      data: [{ name: "Firstname", type: "nominal" }],
    }),
  ).toBeFalsy()

  expect(
    filteringOptionsValidator({
      data: [{ name: "Firstname", type: "nominal", values: [] }],
    }),
  ).toBeFalsy()

  expect(
    filteringOptionsValidator({
      data: [{ name: "Firstname", type: "nominal", values: ["Foo"] }],
    }),
  ).toBeFalsy()

  expect(
    filteringOptionsValidator({
      data: [
        { name: "Firstname", type: "nominal", values: ["a", "b"] },
        { name: "Firstname", type: "nominal", values: ["x"] },
      ],
    }),
  ).toBeFalsy()

  expect(
    filteringOptionsValidator({
      data: [{ name: "Firstname", type: "nominal", values: ["a"] }],
      methods: {
        nominal: null,
      },
    }),
  ).toBeFalsy()

  expect(
    filteringOptionsValidator({
      data: [{ name: "Firstname", type: "nominal", values: ["a"] }],
      methods: {
        nominal: { a: null },
      },
    }),
  ).toBeFalsy()

  expect(
    filteringOptionsValidator({
      data: [{ name: "Firstname", type: "nominal", values: ["a"] }],
      methods: {
        nominal: {
          contian: () => {},
        },
      },
    }),
  ).toBeFalsy()

  // TODO: should be handled
  // expect(
  //   filteringOptionsValidator({
  //     data: [{ name: "Firstname", type: "nominal", values: ["a"] }],
  //     methods: {
  //       nominal: {
  //         contian: () => {},
  //       },
  //       numeric: 0,
  //     },
  //   }),
  // ).toBeFalsy()

  expect(
    filteringOptionsValidator({
      data: [{ name: "Firstname", type: "nominal", values: ["a"] }],
      methods: {
        nominal: {
          contian: () => {},
        },
        numeric: {
          a: null,
        },
      },
    }),
  ).toBeFalsy()

  expect(filteringOptionsValidator(commonProps.filteringOptions)).toBeTruthy()
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

test("expect `onFilterUpdate` event to be called with correct parameters when changing group type select", async ({ commonProps }) => {
  const spyFilterUpdateEvent = vi.fn()
  const methods = render(VueVisualFilter, {
    propsData: { ...commonProps, onFilterUpdate: spyFilterUpdateEvent },
  })

  const groupTypeSelect = methods.queryByTestId("group-type-select")

  await fireEvent.update(groupTypeSelect, GroupType.NOT_AND)
  expect(spyFilterUpdateEvent.calls).toMatchSnapshot()

  await fireEvent.update(groupTypeSelect, GroupType.OR)
  expect(spyFilterUpdateEvent.calls).toMatchSnapshot()

  await fireEvent.update(groupTypeSelect, GroupType.NOT_OR)
  expect(spyFilterUpdateEvent.calls).toMatchSnapshot()
})
