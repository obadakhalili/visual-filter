import { mount } from "@vue/test-utils"
import { FilterType, deepCopy } from "@visual-filter/common"
import applyFilter from "@visual-filter/applyer"

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
const wrapper = mount<
  VueVisualFilter & { [key: string]: any; $options: { watch: any } }
>(VueVisualFilter, { propsData })

jest.mock("@visual-filter/common").mock("@visual-filter/applyer")

describe("computed properties", () => {
  it("computes correct values", () => {
    expect(wrapper.vm.fieldNames).toMatchSnapshot()
    expect(wrapper.vm.numericMethodNames).toMatchSnapshot()
    expect(wrapper.vm.nominalMethodNames).toMatchSnapshot()
  })
})

describe("watcher", () => {
  it("shouldn't emit update-filter event when no listener is passed", () => {
    wrapper.vm.$options.watch.filter.handler.call(wrapper.vm)
    expect(wrapper.emitted()).not.toHaveProperty("filter-update")
  })

  it("should emit update-filter event with correct params when listener is passed", async () => {
    ;(applyFilter as jest.Mock).mockImplementation(
      () => propsData.filteringOptions.data,
    )
    ;(deepCopy as jest.Mock).mockImplementation((obj) => obj)

    const wrapper = mount<VueVisualFilter & { $options: { watch: any } }>(
      VueVisualFilter,
      {
        propsData,
        listeners: { "filter-update": () => {} },
      },
    )
    wrapper.vm.$options.watch.filter.handler.call(wrapper.vm)
    const emittedEvents = wrapper.emitted()
    const [params] = emittedEvents["filter-update"] as unknown[][]

    expect(emittedEvents).toHaveProperty("filter-update")
    expect(params).toMatchSnapshot()
    expect(deepCopy).toHaveBeenCalledTimes(2)
    expect(applyFilter).toHaveBeenCalledTimes(1)
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
