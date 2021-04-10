import "regenerator-runtime"
import { mount } from "@vue/test-utils"

import FilterCondition from "../src/VueVisualFilter/FilterCondition.vue"

describe("FilterCondition.vue", () => {
  const wrapper = mount(FilterCondition, {
    propsData: {
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
    },
  })

  it("emits event on delete button click", async () => {
    const button = wrapper.find("button")

    await button.trigger("click")

    expect(wrapper.emitted()).toHaveProperty("deleteCondition")
  })
})
