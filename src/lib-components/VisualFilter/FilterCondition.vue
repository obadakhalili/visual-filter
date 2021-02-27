<script>
export default {
  name: "FilterCondition",
  emits: ["updateArgument", "deleteCondition"],
  props: [
    "condition",
    "fieldNames",
    "numericMethodNames",
    "nominalMethodNames",
    "DataType"
  ],
  methods: {
    updateArgument(e) {
      let newArgumentValue = e.target.value

      if (this.condition.dataType === this.DataType.NUMERIC) {
        newArgumentValue = Number(newArgumentValue)

        if (newArgumentValue) {
          this.$emit("updateArgument", this.condition, newArgumentValue)
        }
      } else {
        this.$emit("updateArgument", this.condition, newArgumentValue)
      }
    }
  }
}
</script>

<template>
  <div class="space-x-2">
    <select>
      <option
        v-for="field in fieldNames"
        :key="field"
        :value="field"
        :selected="field === condition.fieldName"
      >
        {{ field }}
      </option>
    </select>
    <select>
      <option
        v-for="method in condition.dataType === DataType.NUMERIC
          ? numericMethodNames
          : nominalMethodNames"
        :key="method"
        :value="method"
        :selected="method === condition.method"
      >
        {{ method }}
      </option>
    </select>
    <input type="text" @input="updateArgument" :value="condition.argument" />
    <button @click="$emit('deleteCondition', condition)">x</button>
  </div>
</template>
