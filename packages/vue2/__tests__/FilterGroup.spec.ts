import { mount } from "@vue/test-utils"
import { FilterType, GroupType } from "@visual-filter/common"

import FilterGroup from "../src/VueVisualFilter/FilterGroup.vue"

const filterTypes = Object.values(FilterType)
const groupTypes = Object.values(GroupType)

const propsData = {
  group: {
    filters: [],
    groupType: GroupType.AND,
    type: FilterType.GROUP,
  },
  removable: false,
}
const wrapper = mount<FilterGroup & { [name: string]: any }>(FilterGroup, {
  propsData,
})

describe("group types logic", () => {
  it("should update modeled property", async () => {
    const selectedGroupIndex = 1
    await wrapper
      .find("select")
      .findAll("option")
      .at(selectedGroupIndex)
      .setSelected()
    expect(propsData.group.groupType).toBe(groupTypes[selectedGroupIndex])
  })
})

describe("filter addition logic", () => {
  const selectedFilterIndex = 1
  const addFilterSpy = jest.spyOn(wrapper.vm, "addFilter")

  beforeAll(async () => {
    await wrapper
      .findAll("select")
      .at(1)
      .findAll("option")
      .at(selectedFilterIndex)
      .setSelected()
  })

  it("should call addFilter method on change event", () => {
    expect(addFilterSpy).toHaveBeenCalled()
  })

  it("should emit addFilter on change event with correct paramaters", () => {
    const emittedEvents = wrapper.emitted()
    const [params] = emittedEvents.addFilter as unknown[][]
    expect(params).toEqual([
      propsData.group.filters,
      filterTypes[selectedFilterIndex],
    ])
  })
})
