<script>
import { h } from "vue"
import FilterGroup from "./FilterGroup"
import FilterCondition from "./FilterCondition"

export default {
  name: "VisualFilter",
  props: ["filteringOptions"],
  data() {
    return {
      filter: {
        type: "group",
        groupType: "and",
        filters: []
      }
    }
  },
  computed: {
    numericMethodNames() {
      return Object.keys(this.filteringOptions.methods.numeric)
    },
    nominalMethodNames() {
      return Object.keys(this.filteringOptions.methods.nominal)
    }
  },
  methods: {
    changeGroupType(group, newGroupType) {
      group.groupType = newGroupType
    },
    addFilter(filters, newFilterType) {
      if (newFilterType === "group") {
        filters.push({
          type: "group",
          groupType: "and",
          filters: []
        })
      } else {
        const {
          name,
          type,
          values: [sampleValue]
        } = this.filteringOptions.data[0]

        filters.push({
          type: "condition",
          fieldName: name,
          dataType: type,
          method:
            type === "numeric"
              ? this.numericMethodNames[0]
              : this.nominalMethodNames[0],
          argument: sampleValue
        })
      }
    },
    removeFilter(filterToDelete) {
      function recursiveDeletion(filter, index, filters) {
        if (filter === filterToDelete) {
          filters.splice(index, 1)
        } else if (filter.type === "group") {
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
      if (filter.type === "group") {
        return h(
          FilterGroup,
          {
            group: filter,
            removable: filter !== this.filter,
            onChangeGroupType: this.changeGroupType,
            onAddFilter: this.addFilter,
            onRemoveGroup: this.removeFilter
          },
          () => filter.filters.map(createVisualizer)
        )
      } else {
        return h(FilterCondition)
      }
    }

    return createVisualizer(this.filter)
  }
}
</script>
