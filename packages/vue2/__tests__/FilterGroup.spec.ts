import { mount } from "@vue/test-utils"
import { FilterType, GroupType } from "@visual-filter/common"

import FilterGroup from "../src/VueVisualFilter/FilterGroup.vue"

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
    await wrapper.find("select").findAll("option").at(1).setSelected()
    expect(sharedProps.group.groupType).toMatchSnapshot()
  })
})

describe("filter addition logic", () => {
  const addFilterSpy = jest.spyOn(wrapper.vm, "addFilter")

  beforeAll(async () => {
    await wrapper.findAll("select").at(1).findAll("option").at(1).setSelected()
  })

  it("should call addFilter method on change event", () => {
    expect(addFilterSpy).toHaveBeenCalled()
  })

  it("should emit addFilter on change event with correct paramaters", () => {
    const emittedEvents = wrapper.emitted()
    const [params] = emittedEvents.addFilter as unknown[][]
    expect(params).toMatchSnapshot()
  })
})

describe("filter deletion logic", () => {
  it("shouldn't exit", () => {
    expect(wrapper.find("button").exists()).toBe(false)
  })

  it("should exist after re-setting props with isGroupRemovable set to a truthy value", async () => {
    await wrapper.setProps(generateProps("removableGroup"))
    expect(wrapper.find("button").exists()).toBe(true)
  })

  it("should emit deleteGroup on click event", async () => {
    await wrapper.find("button").trigger("click")
    expect(wrapper.emitted()).toHaveProperty("deleteGroup")
  })
})

describe("slots", () => {
  it("should bound correct values to their corresponding slots", () => {
    const props = generateProps("removableGroup")
    const wrapper = mount(FilterGroup, {
      propsData: props,
      scopedSlots: {
        groupTypes({ groupTypes, group }: unknown) {
          expect(groupTypes).toEqual(groupTypes)
          expect(group).toBe(props.group)
        },
        filterAddition({ filterTypes, addFilter }: unknown) {
          expect(filterTypes).toMatchSnapshot()
          addFilter(FilterType.GROUP)
        },
        groupDeletion({ deleteGroup }: unknown) {
          deleteGroup()
        },
      },
    })
    const emittedEvents = wrapper.emitted()
    expect(emittedEvents).toHaveProperty("addFilter")
    expect(emittedEvents).toHaveProperty("deleteGroup")
  })
})
