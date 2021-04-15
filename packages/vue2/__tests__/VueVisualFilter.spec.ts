import { mount } from "@vue/test-utils"
import { FilterType } from "@visual-filter/common"

import VueVisualFilter from "../src/VueVisualFilter/index.vue"

const propsData = {
  filteringOptions: {
    data: [
      { name: "First Name", type: "nominal", values: [] },
      { name: "Last Name", type: "nominal", values: [] },
      { name: "Grade", type: "numeric", values: [] },
    ],
    methods: {
      numeric: { "=": () => {}, ">": () => {}, "<": () => {} },
      nominal: { contains: () => {}, startsWith: () => {}, endsWith: () => {} },
    },
  },
}
const wrapper = mount<VueVisualFilter & { [key: string]: any }>(
  VueVisualFilter,
  { propsData },
)

describe("computed properties", () => {
  it("computes correct values", () => {
    expect(wrapper.vm.fieldNames).toMatchSnapshot()
    expect(wrapper.vm.numericMethodNames).toMatchSnapshot()
    expect(wrapper.vm.nominalMethodNames).toMatchSnapshot()
  })
})

describe("methods", () => {
  it("adds correct filter objects by addFilter method", () => {
    wrapper.vm.addFilter(wrapper.vm.filter.filters, FilterType.GROUP)
    wrapper.vm.addFilter(wrapper.vm.filter.filters, FilterType.CONDITION)
    expect(wrapper.vm.filter.filters[0]).toMatchSnapshot()
    expect(wrapper.vm.filter.filters[1]).toMatchSnapshot()
  })

  it("removes correct filter object by removeFilter method", () => {
    wrapper.vm.deleteFilter(0, wrapper.vm.filter.filters)
    expect(wrapper.vm.filter.filters).toMatchSnapshot()
  })

  it("doesn't update condition field when changed to same type", () => {
    wrapper.vm.updateConditionField(
      wrapper.vm.filter.filters[0],
      propsData.filteringOptions.data[1].name,
    )
    expect(wrapper.vm.filter.filters[0]).toMatchSnapshot()
  })

  it("updates condition field when changed to different type", () => {
    wrapper.vm.updateConditionField(
      wrapper.vm.filter.filters[0],
      propsData.filteringOptions.data[2].name,
    )
    expect(wrapper.vm.filter.filters[0]).toMatchSnapshot()
  })
})
