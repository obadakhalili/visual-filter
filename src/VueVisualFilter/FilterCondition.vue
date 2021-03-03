<script>
import { DataType } from "./index.vue"

export default {
  name: "FilterCondition",
  emits: ["updateField", "updateMethod", "updateArgument", "deleteCondition"],
  props: {
    condition: {
      type: Object,
      required: true,
      validator(value) {
        return value.constructor === Object
      }
    },
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
    }
  },
  computed: {
    isNumeric() {
      return this.condition.dataType === DataType.NUMERIC
    }
  },
  methods: {
    updateField(newFieldName) {
      if (this.fieldNames.includes(newFieldName)) {
        this.$emit("updateField", this.condition, newFieldName)
      }
    },
    updateMethod(newMethodName) {
      if (
        this.condition.dataType === DataType.NUMERIC &&
        this.numericMethodNames.includes(newMethodName)
      ) {
        this.$emit("updateMethod", this.condition, newMethodName)
      } else if (
        this.condition.dataType === DataType.NOMINAL &&
        this.nominalMethodNames.includes(newMethodName)
      ) {
        this.$emit("updateMethod", this.condition, newMethodName)
      }
    },
    updateArgument(newArgumentValue) {
      if (this.condition.dataType === DataType.NUMERIC) {
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
    <slot
      name="fieldUpdation"
      :fieldNames="fieldNames"
      :updateField="updateField"
    >
      <select @change="updateField($event.target.value)">
        <option v-for="field in fieldNames" :key="field" :value="field">
          {{ field }}
        </option>
      </select>
    </slot>
    <slot
      name="methodUpdation"
      :numericMethodNames="isNumeric && numericMethodNames"
      :nominalMethodNames="isNumeric === false && nominalMethodNames"
      :updateMethod="updateMethod"
    >
      <select @change="updateMethod($event.target.value)">
        <option
          v-for="method in isNumeric ? numericMethodNames : nominalMethodNames"
          :key="method"
          :value="method"
        >
          {{ method }}
        </option>
      </select>
    </slot>
    <slot
      name="argumentUpdation"
      :argument="condition.argument"
      :updateArgument="updateArgument"
    >
      <input
        type="text"
        @input="updateArgument($event.target.value)"
        :value="condition.argument"
      />
    </slot>
    <slot
      name="conditionDeletion"
      :deleteCondition="() => $emit('deleteCondition', condition)"
    >
      <button @click="$emit('deleteCondition', condition)">x</button>
    </slot>
  </div>
</template>
