import "regenerator-runtime"
import { mount } from "@vue/test-utils"

import FilterCondition from "../src/VueVisualFilter/FilterCondition.vue"

const propsData = {
  condition: {
    argument: "Obada",
    dataType: "nominal",
    fieldName: "First Name",
    method: "contains",
    type: "condition",
  },
  fieldNames: ["First Name", "Last Name", "Grade"],
  nominalMethodNames: ["contains", "startsWith", "endsWith"],
  numericMethodNames: ["=", ">", "<"],
}
const wrapper = mount(FilterCondition, { propsData })

describe("field updation logic", () => {
  const selectedIndex = 1
  const updateFieldSpy = jest.spyOn(wrapper.vm, "updateField")

  beforeAll(async () => {
    await wrapper
      .find("select")
      .findAll("option")
      .at(selectedIndex)
      .setSelected()
  })

  it("should update modeled property", () => {
    expect(propsData.condition.fieldName).toBe(
      propsData.fieldNames[selectedIndex],
    )
  })

  it("should call updateField method on change event", () => {
    expect(updateFieldSpy).toHaveBeenCalled()
  })

  it("should emit updateField on change event with correct paramaters", () => {
    const emittedEvents = wrapper.emitted()
    const [params] = emittedEvents.updateField
    expect(params).toEqual([
      wrapper.vm.condition,
      propsData.fieldNames[selectedIndex],
    ])
  })
})

describe("condition deletion logic", () => {
  it("should emit deleteCondition on click event", async () => {
    const button = wrapper.find("button")
    await button.trigger("click")
    expect(wrapper.emitted()).toHaveProperty("deleteCondition")
  })
})
