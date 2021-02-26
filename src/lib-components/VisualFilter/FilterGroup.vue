<script>
export default {
  name: "FilterGroup",
  emits: ["addFilter", "changeGroupType"],
  props: ["group"],
  data() {
    return {
      groupTypes: ["and", "not and", "or", "not or"]
    }
  },
  methods: {
    addFilter(e) {
      const newFilterType = e.target.value

      if (newFilterType === "group" || newFilterType === "condition") {
        this.$emit("addFilter", this.group.filters, newFilterType)
      }
    },
    changeGroupType(e) {
      const newGroupType = e.target.value

      if (this.groupTypes.includes(newGroupType)) {
        this.$emit("changeGroupType", this.group, newGroupType)
      }
    }
  }
}
</script>

<template>
  <select @change="changeGroupType" class="mr-2">
    <option v-for="type in this.groupTypes" :key="type" :value="type">
      {{ type }}
    </option>
  </select>
  <select @change="addFilter">
    <option value="group">Group</option>
    <option value="condition">Condition</option>
  </select>
  <div v-if="group.filters.length" class="ml-5 mt-2">
    <slot></slot>
  </div>
</template>
