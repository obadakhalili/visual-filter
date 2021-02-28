<script>
const objectPropAttrs = {
  type: Object,
  required: true,
  validator(value) {
    return value.constructor === Object
  }
}

export default {
  name: "FilterCondition",
  emits: ["updateField", "updateMethod", "updateArgument", "deleteCondition"],
  props: {
    condition: objectPropAttrs,
    fieldNames: {
      type: Array,
      required: true
    },
    numericMethodNames: {
      type: Array,
      required: true
    },
    nominalMethodNames: {
      type: Array,
      required: true
    },
    DataType: objectPropAttrs
  },
  methods: {
    updateField(e) {
      const newFieldName = e.target.value

      if (this.fieldNames.includes(newFieldName)) {
        this.$emit("updateField", this.condition, newFieldName)
      }
    },
    updateMethod(e) {
      const newMethodName = e.target.value

      if (
        this.condition.dataType === this.DataType.NUMERIC &&
        this.numericMethodNames.includes(newMethodName)
      ) {
        this.$emit("updateMethod", this.condition, newMethodName)
      } else if (
        this.condition.dataType === this.DataType.NOMINAL &&
        this.nominalMethodNames.includes(newMethodName)
      ) {
        this.$emit("updateMethod", this.condition, newMethodName)
      }
    },
    updateArgument(e) {
      let newArgumentValue = e.target.value

      if (this.condition.dataType === this.DataType.NUMERIC) {
        newArgumentValue = Number(newArgumentValue)

        if (isNaN(newArgumentValue) === false) {
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
    <select @change="updateField">
      <option
        v-for="field in fieldNames"
        :key="field"
        :value="field"
        :selected="field === condition.fieldName"
      >
        {{ field }}
      </option>
    </select>
    <select @change="updateMethod">
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
