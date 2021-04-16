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
  const updateFieldSpy = jest.spyOn(wrapper.vm, "updateField")

  beforeAll(async () => {
    await wrapper
      .find("select")
      .findAll("option")
      .at(1)
      .setSelected()
  })

  it("should update modeled property", () => {
    expect(sharedProps.condition.fieldName).toMatchSnapshot()
  })

  it("should call updateField method on change event", () => {
    expect(updateFieldSpy).toHaveBeenCalled()
  })

  it("should emit updateField on change event with correct paramaters", () => {
    const emittedEvents = wrapper.emitted()
    const [params] = emittedEvents.updateField as unknown[][]
    expect(params).toMatchSnapshot()
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
    expect(sharedProps.condition.method).toMatchSnapshot()
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
  it("should bound correct values to their corresponding slots", () => {
    const props = generateProps()
    const wrapper = mount(FilterCondition, {
      propsData: props,
      scopedSlots: {
        fieldUpdation({ condition, fieldNames, updateField }: unknown) {
          expect(condition).toBe(props.condition)
          expect(fieldNames).toBe(props.fieldNames)
          updateField(props.fieldNames[1])
        },
        methodUpdation({
          numericMethodNames,
          nominalMethodNames,
          condition,
        }: unknown) {
          expect(numericMethodNames).toBe(false)
          expect(nominalMethodNames).toBe(props.nominalMethodNames)
          expect(condition).toBe(props.condition)
        },
        argumentUpdation({ condition }: unknown) {
          expect(condition).toBe(props.condition)
        },
        conditionDeletion({ deleteCondition }: unknown) {
          deleteCondition(props.condition)
        },
      },
    })
    const emittedEvents = wrapper.emitted()
    expect(emittedEvents).toHaveProperty("updateField")
    expect(emittedEvents).toHaveProperty("deleteCondition")
  })
})
