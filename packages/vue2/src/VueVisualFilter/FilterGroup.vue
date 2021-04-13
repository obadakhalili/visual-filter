<script>
import { FilterType, GroupType } from "@visual-filter/common"

export default {
  name: "FilterGroup",
  props: {
    group: {
      type: Object,
      required: true,
      validator(value) {
        return value.constructor === Object
      },
    },
    removable: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      filterTypes: Object.values(FilterType),
      groupTypes: Object.values(GroupType),
    }
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
        <select v-model="group.groupType">
          <option v-for="type in groupTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
      </slot>
      <slot name="filterAddition" v-bind="{ filterTypes, addFilter }">
        <select @change="addFilter($event.target.value)">
          <option v-for="type in filterTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
      </slot>
      <slot
        v-if="removable"
        name="groupDeletion"
        :deleteGroup="() => $emit('deleteGroup')"
      >
        <button @click="$emit('deleteGroup')">x</button>
      </slot>
    </div>
    <div v-if="group.filters.length" class="ml-10 space-y-1">
      <slot name="groupChildren"></slot>
    </div>
  </div>
</template>
