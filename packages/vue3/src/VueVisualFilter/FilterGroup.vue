<script>
export default {
  name: "FilterGroup",
  emits: ["addFilter", "deleteGroup"],
  props: {
    group: {
      type: Object,
      required: true,
      validator(value) {
        return value.constructor === Object
      },
    },
    filterTypes: {
      type: Array,
      required: true,
    },
    groupTypes: {
      type: Array,
      required: true,
    },
    removable: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    addFilter(newFilterType) {
      if (this.filterTypes.includes(newFilterType)) {
        this.$emit("addFilter", this.group.filters, newFilterType)
      }
    },
  },
}
</script>

<template>
  <div class="space-y-4">
    <div class="space-x-2">
      <slot name="groupTypes" v-bind="{ groupTypes, group }">
        <select v-model="group.groupType" data-testId="group-type-select">
          <option v-for="type in groupTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
      </slot>
      <slot name="filterAddition" v-bind="{ filterTypes, addFilter }">
        <select
          @change="addFilter($event.target.value)"
          data-testId="filter-type-select"
        >
          <option v-for="type in filterTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
      </slot>
      <slot
        v-if="removable"
        name="groupDeletion"
        :deleteGroup="() => $emit('deleteGroup', group)"
      >
        <button @click="$emit('deleteGroup', group)">x</button>
      </slot>
    </div>
    <div v-if="group.filters.length" class="ml-10 space-y-1">
      <slot name="groupChildren"></slot>
    </div>
  </div>
</template>
