import { render, fireEvent, queryByTestId } from "@testing-library/vue"
import "@testing-library/jest-dom"
import { GroupType, FilterType, DataType } from "@visual-filter/common"

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

test("expect `onFilterUpdate` event to be called with correct parameters when changing group type select", async ({
  commonProps,
}) => {
  const spyFilterUpdateEvent = vi.fn()
  const methods = render(VueVisualFilter, {
    propsData: { ...commonProps, onFilterUpdate: spyFilterUpdateEvent },
  })

  const groupTypeSelect = methods.queryByTestId("group-type-select")

  await fireEvent.update(groupTypeSelect, GroupType.NOT_AND)

  expect(groupTypeSelect).toHaveValue(GroupType.NOT_AND)
  expect(spyFilterUpdateEvent.calls).toMatchSnapshot()

  await fireEvent.update(groupTypeSelect, GroupType.OR)

  expect(groupTypeSelect).toHaveValue(GroupType.OR)
  expect(spyFilterUpdateEvent.calls).toMatchSnapshot()

  await fireEvent.update(groupTypeSelect, GroupType.NOT_OR)

  expect(groupTypeSelect).toHaveValue(GroupType.NOT_OR)
  expect(spyFilterUpdateEvent.calls).toMatchSnapshot()
})

test("filter of type condition renders as expected on initial render after selecting from group type select, and callback is called with correct parameters", async ({
  commonProps,
}) => {
  const spyFilterUpdateEvent = vi.fn()
  const methods = render(VueVisualFilter, {
    props: {
      ...commonProps,
      onFilterUpdate: spyFilterUpdateEvent,
    },
  })

  const filterTypeSelect = methods.queryByTestId("filter-type-select")

  await fireEvent.update(filterTypeSelect, FilterType.CONDITION)

  expect(filterTypeSelect).toHaveValue(FilterType.CONDITION)

  const {
    data: [
      {
        fieldName: firstFieldName,
        type: firstFieldType,
        values: [firstValue],
      },
    ],
    methods: methodsOptions,
  } = commonProps.filteringOptions

  const fieldNameSelect = methods.queryByTestId("field-name-select")

  expect(fieldNameSelect).toBeTruthy()
  expect(fieldNameSelect).toHaveValue(firstFieldName)

  const methodSelect = methods.queryByTestId("method-select")

  expect(methodSelect).toBeTruthy()
  expect(methodSelect).toHaveValue(
    Object.keys(
      firstFieldType === DataType.NOMINAL
        ? methodsOptions.nominal
        : methodsOptions.numeric,
    )[0],
  )

  const argumentInput = methods.queryByTestId("argument-input")

  expect(argumentInput).toBeTruthy()
  expect(argumentInput).toHaveValue(firstValue)

  expect(spyFilterUpdateEvent.calls).toMatchSnapshot()
})

test("end-to-end test the component", async ({ commonProps }) => {
  let latestCallIndex = -1
  const spyFilterUpdateEvent = vi.fn(() => {
    ++latestCallIndex
  })
  const methods = render(VueVisualFilter, {
    props: {
      ...commonProps,
      onFilterUpdate: spyFilterUpdateEvent,
    },
  })

  await fireEvent.update(
    methods.queryByTestId("filter-type-select"),
    FilterType.CONDITION,
  )

  expect(spyFilterUpdateEvent.calls[latestCallIndex]).toMatchSnapshot()

  await fireEvent.update(
    methods.queryByTestId("group-type-select"),
    GroupType.OR,
  )
  await fireEvent.update(
    methods.queryByTestId("filter-type-select"),
    FilterType.GROUP,
  )
  await fireEvent.update(
    methods.queryAllByTestId("filter-type-select")[1],
    FilterType.CONDITION,
  )

  await fireEvent.update(
    methods.queryAllByTestId("field-name-select")[1],
    "Last Name",
  )
  await fireEvent.update(methods.queryAllByTestId("argument-input")[1], "Buz")

  expect(spyFilterUpdateEvent.calls[latestCallIndex]).toMatchSnapshot()

  await fireEvent.update(
    methods.queryAllByTestId("filter-type-select")[1],
    FilterType.CONDITION,
  )

  await fireEvent.update(
    methods.queryAllByTestId("field-name-select")[2],
    "Age",
  )
  await fireEvent.update(methods.queryAllByTestId("method-select")[2], ">")
  await fireEvent.update(methods.queryAllByTestId("argument-input")[2], 18)

  expect(spyFilterUpdateEvent.calls[latestCallIndex]).toMatchSnapshot()

  await fireEvent.click(methods.queryByTestId("remove-group-button"))

  expect(methods.queryAllByTestId("group-type-select").length).toBe(1)
  expect(methods.queryAllByTestId("filter-type-select").length).toBe(1)
  expect(spyFilterUpdateEvent.calls[latestCallIndex]).toMatchSnapshot()

  await fireEvent.click(methods.queryByTestId("remove-condition-button"))
  await fireEvent.update(methods.queryByTestId("group-type-select"), GroupType.AND)

  expect(methods.queryAllByTestId("field-name-select").length).toBe(0)
  expect(methods.queryAllByTestId("method-select").length).toBe(0)
  expect(methods.queryAllByTestId("argument-input").length).toBe(0)

  expect(spyFilterUpdateEvent.calls[latestCallIndex]).toMatchSnapshot()
})
