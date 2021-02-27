<script>
import { h } from "vue"
import FilterGroup from "./FilterGroup.vue"
import FilterCondition from "./FilterCondition.vue"
import { createEnum } from "../../helpers"

const FilterType = createEnum({
  GROUP: "group",
  CONDITION: "condition"
})

const GroupType = createEnum({
  AND: "and",
  NOT_AND: "not and",
  OR: "or",
  NOT_OR: "not or"
})

const DataType = createEnum({
  NUMERIC: "numeric",
  NOMINAL: "nominal"
})

export default {
  name: "VisualFilter",
  props: ["filteringOptions"],
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
          values: [sampleValue]
        } = this.filteringOptions.data[0]

        filters.push({
          type: FilterType.CONDITION,
          fieldName: name,
          dataType: type,
          method:
            type === DataType.NUMERIC
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
            removable: filter !== this.filter,
            filterTypes: Object.values(FilterType),
            groupTypes: Object.values(GroupType),
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
