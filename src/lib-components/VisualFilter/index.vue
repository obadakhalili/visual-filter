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
    changeGroupType(group, newGroupType) {
      group.groupType = newGroupType
    }
  },
  render() {
    const createVisualizer = (filter) => {
      if (filter.type === "group") {
        return h(
          FilterGroup,
          {
            group: filter,
            onAddFilter: this.addFilter,
            onChangeGroupType: this.changeGroupType
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
