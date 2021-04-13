<script>
import {
  FilterType,
  GroupType,
  DataType,
  deepCopy,
} from "@visual-filter/common"
import applyFilter from "@visual-filter/applyer"

import FilterGroup from "./FilterGroup.vue"
import FilterCondition from "./FilterCondition.vue"

export default {
  name: "VueVisualFilter",
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
                  : true),
            ) &&
            Object.values(value.methods.numeric).every(
              (method) => typeof method === "function",
            ) &&
            Object.values(value.methods.nominal).every(
              (method) => typeof method === "function",
            )
          )
        } catch {
          return false
        }
      },
    },
  },
  data() {
    return {
      filter: {
        type: FilterType.GROUP,
        groupType: GroupType.AND,
        filters: [],
      },
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
    },
  },
  watch: {
    filter: {
      deep: true,
      handler() {
        if (this.$listeners["filter-update"]) {
          this.$emit("filter-update", {
            filter: deepCopy(this.filter),
            data: applyFilter(
              this.filter,
              this.filteringOptions.methods,
              deepCopy(this.filteringOptions.data),
            ),
          })
        }
      },
    },
  },
  methods: {
    updateConditionField(condition, newFieldName) {
      const {
        type: newType,
        values: [newSampleValue = ""],
      } = this.filteringOptions.data.find(
        (field) => field.name === newFieldName,
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
          filters: [],
        })
      } else {
        const {
          name,
          type,
          values: [sampleValue = ""],
        } = this.filteringOptions.data[0]

        filters.push({
          type: FilterType.CONDITION,
          fieldName: name,
          dataType: type,
          method:
            (type === DataType.NUMERIC
              ? this.numericMethodNames[0]
              : this.nominalMethodNames[0]) || "",
          argument: sampleValue,
        })
      }
    },
    deleteFilter(filterIndex, parentGroup) {
      parentGroup.splice(filterIndex, 1)
    },
  },
  render(createElement) {
    return createVisualFilter.call(this, this.filter)

    function createVisualFilter(filter, filterIndex, parentGroup) {
      if (filter.type === FilterType.GROUP) {
        const removable = filter !== this.filter

        return createElement(FilterGroup, {
          props: {
            group: filter,
            removable,
          },
          on: {
            addFilter: this.addFilter,
            deleteGroup: removable
              ? () => this.deleteFilter(filterIndex, parentGroup)
              : () => {},
          },
          scopedSlots: {
            groupTypes: this.$slots.groupTypes,
            filterAddition: this.$slots.filterAddition,
            groupDeletion: this.$slots.groupDeletion,
            groupChildren: () =>
              filter.filters.map((childFilter, childFilterIndex, parentGroup) =>
                createVisualFilter.call(
                  this,
                  childFilter,
                  childFilterIndex,
                  parentGroup,
                ),
              ),
          },
        })
      } else {
        return createElement(FilterCondition, {
          props: {
            condition: filter,
            fieldNames: this.fieldNames,
            numericMethodNames: this.numericMethodNames,
            nominalMethodNames: this.nominalMethodNames,
          },
          on: {
            updateField: this.updateConditionField,
            deleteCondition: () => this.deleteFilter(filterIndex, parentGroup),
          },
          scopedSlots: {
            fieldUpdation: this.$slots.fieldUpdation,
            methodUpdation: this.$slots.methodUpdation,
            argumentUpdation: this.$slots.argumentUpdation,
            conditionDeletion: this.$slots.conditionDeletion,
          },
        })
      }
    }
  },
}
</script>
