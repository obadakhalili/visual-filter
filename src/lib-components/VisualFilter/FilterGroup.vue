<script>
export default {
  name: "FilterGroup",
  emits: ["changeGroupType", "addFilter", "deleteGroup"],
  props: ["group", "removable", "filterTypes", "groupTypes"],
  methods: {
    changeGroupType(e) {
      const newGroupType = e.target.value

      if (this.groupTypes.includes(newGroupType)) {
        this.$emit("changeGroupType", this.group, newGroupType)
      }
    },
    addFilter(e) {
      const newFilterType = e.target.value

      if (this.filterTypes.includes(newFilterType)) {
        this.$emit("addFilter", this.group.filters, newFilterType)
      }
    }
  }
}
</script>

<template>
  <div class="space-x-3">
    <select @change="changeGroupType">
      <option v-for="type in groupTypes" :key="type" :value="type">
        {{ type }}
      </option>
    </select>
    <select @change="addFilter">
      <option v-for="type in filterTypes" :key="type" :value="type">
        {{ type }}
      </option>
    </select>
    <button v-if="removable" @click="$emit('deleteGroup', group)">x</button>
  </div>
  <div v-if="group.filters.length" class="ml-10 mt-2 space-y-2">
    <slot></slot>
  </div>
</template>
