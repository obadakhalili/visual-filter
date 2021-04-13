import { mount } from "@vue/test-utils"
import { FilterType, GroupType } from "@visual-filter/common"

import FilterGroup from "../src/VueVisualFilter/FilterGroup.vue"

const availableFilterTypes = Object.values(FilterType)
const availableGroupTypes = Object.values(GroupType)

function generateProps(isGroupRemovable: boolean | string = false) {
  return {
    group: {
      filters: [],
      groupType: GroupType.AND,
      type: FilterType.GROUP,
    },
    removable: isGroupRemovable ? true : false,
  }
}

const sharedProps = generateProps()
const wrapper = mount<FilterGroup & { [name: string]: any }>(FilterGroup, {
  propsData: sharedProps,
})

describe("group types logic", () => {
  it("should update modeled property", async () => {
    const selectedGroupIndex = 1
    await wrapper
      .find("select")
      .findAll("option")
      .at(selectedGroupIndex)
      .setSelected()
    expect(sharedProps.group.groupType).toBe(
      availableGroupTypes[selectedGroupIndex],
    )
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
      sharedProps.group.filters,
      availableFilterTypes[selectedFilterIndex],
    ])
  })
})

describe("filter deletion logic", () => {
  it("shouldn't exit", () => {
    expect(wrapper.find("button").exists()).toBe(false)
  })

  it("should exist after re-setting props with isGroupRemovable set to a truthy value", async () => {
    await wrapper.setProps(generateProps("removableGroup"))
  })

  it("should emit deleteGroup on click event", async () => {
    await wrapper.find("button").trigger("click")
    expect(wrapper.emitted()).toHaveProperty("deleteGroup")
  })
})

describe("slots", () => {
  it("should bound correct values to their corresponding slots", () => {
    const sharedProps = generateProps("removableGroup")
    const wrapper = mount(FilterGroup, {
      propsData: sharedProps,
      scopedSlots: {
        groupTypes({
          groupTypes,
          group,
        }: {
          groupTypes: typeof availableGroupTypes
          group: typeof sharedProps.group
        }) {
          expect(groupTypes).toEqual(groupTypes)
          expect(group).toBe(sharedProps.group)
        },
        filterAddition({
          filterTypes,
          addFilter,
        }: {
          filterTypes: typeof availableFilterTypes
          addFilter(newFilterType: FilterType): void
        }) {
          expect(filterTypes).toEqual(availableFilterTypes)
          addFilter(FilterType.GROUP)
        },
        groupDeletion({ deleteGroup }: { deleteGroup(): void }) {
          deleteGroup()
        },
      },
    })
    const emittedEvents = wrapper.emitted()
    expect(emittedEvents).toHaveProperty("addFilter")
    expect(emittedEvents).toHaveProperty("deleteGroup")
  })
})
