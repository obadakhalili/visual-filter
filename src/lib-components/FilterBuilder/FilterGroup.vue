<script>
export default {
  name: "FilterGroup",
  emits: ["updateType", "addFilter", "deleteGroup"],
  props: {
    group: {
      type: Object,
      required: true,
      validator(value) {
        return value.constructor === Object
      }
    },
    filterTypes: {
      type: Array,
      required: true
    },
    groupTypes: {
      type: Array,
      required: true
    },
    removable: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    updateType(e) {
      const newGroupType = e.target.value

      if (this.groupTypes.includes(newGroupType)) {
        this.$emit("updateType", this.group, newGroupType)
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
  <div class="space-y-4">
    <div class="space-x-2">
      <select @change="updateType">
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
    <div v-if="group.filters.length" class="ml-10 space-y-1">
      <slot></slot>
    </div>
  </div>
</template>
