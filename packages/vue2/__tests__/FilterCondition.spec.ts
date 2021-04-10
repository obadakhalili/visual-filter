import { mount } from "@vue/test-utils"

import FilterCondition from "../src/VueVisualFilter/FilterCondition.vue"

const propsData = {
  condition: {
    argument: "John",
    dataType: "nominal",
    fieldName: "First Name",
    method: "contains",
    type: "condition",
  },
  fieldNames: ["First Name", "Last Name", "Grade"],
  nominalMethodNames: ["contains", "startsWith", "endsWith"],
  numericMethodNames: ["=", ">", "<"],
}
const wrapper = mount(FilterCondition, { propsData } as any)

describe("field updation logic", () => {
  const selectedIndex = 1
  const updateFieldSpy = jest.spyOn(wrapper.vm, "updateField" as any)

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
    const [params]: any = emittedEvents.updateField
    expect(params).toEqual([
      (wrapper.vm as any).condition,
      propsData.fieldNames[selectedIndex],
    ])
  })
})

describe("method updation logic", () => {
  it("should update modeled property", async () => {
    const selectedIndex = 1
    await wrapper
      .findAll("select")
      .at(1)
      .findAll("option")
      .at(selectedIndex)
      .setSelected()
    expect(propsData.condition.method).toBe(
      propsData.nominalMethodNames[selectedIndex],
    )
  })
})

describe("argument updation logic", () => {
  it("should update modeled property", async () => {
    const newValue = "new value"
    await wrapper.find("input").setValue(newValue)
    expect(propsData.condition.argument).toBe(newValue)
  })
})

describe("condition deletion logic", () => {
  it("should emit deleteCondition on click event", async () => {
    await wrapper.find("button").trigger("click")
    expect(wrapper.emitted()).toHaveProperty("deleteCondition")
  })
})
