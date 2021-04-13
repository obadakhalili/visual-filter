import { mount } from "@vue/test-utils"

import FilterCondition from "../src/VueVisualFilter/FilterCondition.vue"

function generateProps() {
  return {
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
}

const sharedProps = generateProps()
const wrapper = mount<FilterCondition & { [key: string]: any }>(
  FilterCondition,
  { propsData: sharedProps },
)

describe("field updation logic", () => {
  const selectedFieldNameIndex = 1
  const updateFieldSpy = jest.spyOn(wrapper.vm, "updateField")

  beforeAll(async () => {
    await wrapper
      .find("select")
      .findAll("option")
      .at(selectedFieldNameIndex)
      .setSelected()
  })

  it("should update modeled property", () => {
    expect(sharedProps.condition.fieldName).toBe(
      sharedProps.fieldNames[selectedFieldNameIndex],
    )
  })

  it("should call updateField method on change event", () => {
    expect(updateFieldSpy).toHaveBeenCalled()
  })

  it("should emit updateField on change event with correct paramaters", () => {
    const emittedEvents = wrapper.emitted()
    const [params] = emittedEvents.updateField as unknown[][]
    expect(params).toEqual([
      wrapper.vm.condition,
      sharedProps.fieldNames[selectedFieldNameIndex],
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
    expect(sharedProps.condition.method).toBe(
      sharedProps.nominalMethodNames[selectedIndex],
    )
  })
})

describe("argument updation logic", () => {
  it("should update modeled property", async () => {
    const newValue = "new value"
    await wrapper.find("input").setValue(newValue)
    expect(sharedProps.condition.argument).toBe(newValue)
  })
})

describe("condition deletion logic", () => {
  it("should emit deleteCondition on click event", async () => {
    await wrapper.find("button").trigger("click")
    expect(wrapper.emitted()).toHaveProperty("deleteCondition")
  })
})

describe("slots", () => {
  const sharedProps = generateProps()
  it("should receive correct bound values from fieldUpdation slot", () => {
    const wrapper = mount(FilterCondition, {
      propsData: sharedProps,
      scopedSlots: {
        fieldUpdation({
          condition,
          fieldNames,
          updateField,
        }: {
          condition: typeof sharedProps["condition"]
          fieldNames: typeof sharedProps["fieldNames"]
          updateField: (fieldName: string) => void
        }) {
          expect(condition).toBe(sharedProps.condition)
          expect(fieldNames).toBe(sharedProps.fieldNames)
          updateField(sharedProps.fieldNames[2])
        },
      },
    })
    expect(wrapper.emitted()).toHaveProperty("updateField")
  })

  it("should receive correct bound values from methodUpdation slot", () => {
    mount(FilterCondition, {
      propsData: sharedProps,
      scopedSlots: {
        methodUpdation({
          numericMethodNames,
          nominalMethodNames,
          condition,
        }: {
          numericMethodNames: false
          nominalMethodNames: typeof sharedProps["nominalMethodNames"]
          condition: typeof sharedProps["fieldNames"]
        }) {
          expect(numericMethodNames).toBe(false)
          expect(nominalMethodNames).toBe(sharedProps.nominalMethodNames)
          expect(condition).toBe(sharedProps.condition)
        },
      },
    })
  })

  it("should receive correct bound values from argumentUpdation slot", () => {
    mount(FilterCondition, {
      propsData: sharedProps,
      scopedSlots: {
        argumentUpdation({
          condition,
        }: {
          condition: typeof sharedProps["fieldNames"]
        }) {
          expect(condition).toBe(sharedProps.condition)
        },
      },
    })
  })

  it("should receive correct bound values from conditionDeletion slot", () => {
    const wrapper = mount(FilterCondition, {
      propsData: sharedProps,
      scopedSlots: {
        conditionDeletion({
          deleteCondition,
        }: {
          deleteCondition: (condition: typeof sharedProps["condition"]) => void
        }) {
          deleteCondition(sharedProps.condition)
        },
      },
    })
    expect(wrapper.emitted()).toHaveProperty("deleteCondition")
  })
})
