<script>
import { h } from "vue"
import FilterGroup from "./FilterGroup.vue"
import FilterCondition from "./FilterCondition.vue"
import { createEnum, deepCopy, applyFilter } from "@/helpers.js"

export const FilterType = createEnum({
  GROUP: "group",
  CONDITION: "condition"
})

export const GroupType = createEnum({
  AND: "and",
  NOT_AND: "not and",
  OR: "or",
  NOT_OR: "not or"
})

export const DataType = createEnum({
  NUMERIC: "numeric",
  NOMINAL: "nominal"
})

export default {
  name: "VueVisualFilter",
  emits: ["filterUpdate"],
  props: {
    filteringOptions: {
      type: Object,
      required: true,
      validator(value) {
        try {
          return (
            value.data.length &&
            value.data.every(
              (field, index, fields) =>
                typeof field.name === "string" &&
                typeof field.type === "string" &&
                field.values.constructor === Array &&
                (index > 0
                  ? field.values.length === fields[index - 1].values.length
                  : true)
            ) &&
            Object.values(value.methods.numeric).every(
              (method) => typeof method === "function"
            ) &&
            Object.values(value.methods.nominal).every(
              (method) => typeof method === "function"
            )
          )
        } catch {
          return false
        }
      }
    }
  },
  data() {
    return {
      filter: {
        type: FilterType.GROUP,
        groupType: GroupType.AND,
        filters: []
      }
    }
  },
  computed: {
    fieldNames() {
      return this.filteringOptions.data.map((field) => field.name)
    },
    numericMethodNames() {
      return Object.keys(this.filteringOptions.methods.numeric)
    },
    nominalMethodNames() {
      return Object.keys(this.filteringOptions.methods.nominal)
    }
  },
  watch: {
    filter: {
      deep: true,
      handler() {
        this.$emit("filterUpdate", {
          filter: deepCopy(this.filter),
          data: applyFilter(
            this.filter,
            this.filteringOptions.methods,
            deepCopy(this.filteringOptions.data)
          )
        })
      }
    }
  },
  methods: {
    updateConditionField(condition, newFieldName) {
      const {
        type: newType,
        values: [newSampleValue = ""]
      } = this.filteringOptions.data.find(
        (field) => field.name === newFieldName
      )
      if (condition.dataType !== newType) {
        condition.method =
          (newType === DataType.NUMERIC
            ? this.numericMethodNames[0]
            : this.nominalMethodNames[0]) || ""
        condition.argument = newSampleValue
        condition.dataType = newType
      }
    },
    addFilter(filters, newFilterType) {
      if (newFilterType === FilterType.GROUP) {
        filters.push({
          type: FilterType.GROUP,
          groupType: GroupType.AND,
          filters: []
        })
      } else {
        const {
          name,
          type,
          values: [sampleValue = ""]
        } = this.filteringOptions.data[0]

        filters.push({
          type: FilterType.CONDITION,
          fieldName: name,
          dataType: type,
          method:
            (type === DataType.NUMERIC
              ? this.numericMethodNames[0]
              : this.nominalMethodNames[0]) || "",
          argument: sampleValue
        })
      }
    },
    deleteFilter(filterToDelete) {
      function recursiveDeletion(filter, index, filters) {
        if (filter === filterToDelete) {
          filters.splice(index, 1)
        } else if (filter.type === FilterType.GROUP) {
          filter.filters.map(recursiveDeletion)
        }
      }

      if (filterToDelete !== this.filter) {
        recursiveDeletion(this.filter)
      }
    }
  },
  render() {
    const createVisualizer = (filter) => {
      if (filter.type === FilterType.GROUP) {
        return h(
          FilterGroup,
          {
            group: filter,
            filterTypes: Object.values(FilterType),
            groupTypes: Object.values(GroupType),
            removable: filter !== this.filter,
            onAddFilter: this.addFilter,
            onDeleteGroup: this.deleteFilter
          },
          {
            groupTypes: this.$slots.groupTypes,
            filterAddition: this.$slots.filterAddition,
            groupDeletion: this.$slots.groupDeletion,
            groupChildren: () => filter.filters.map(createVisualizer)
          }
        )
      } else {
        return h(
          FilterCondition,
          {
            condition: filter,
            fieldNames: this.fieldNames,
            numericMethodNames: this.numericMethodNames,
            nominalMethodNames: this.nominalMethodNames,
            onUpdateField: this.updateConditionField,
            onDeleteCondition: this.deleteFilter
          },
          {
            fieldUpdation: this.$slots.fieldUpdation,
            methodUpdation: this.$slots.methodUpdation,
            argumentUpdation: this.$slots.argumentUpdation,
            conditionDeletion: this.$slots.conditionDeletion
          }
        )
      }
    }

    return createVisualizer(this.filter)
  }
}
</script>
