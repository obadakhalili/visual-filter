import common from "@visual-filter/common"

export = function applyFilter(filter: any, methods: any, data: any) {
  function buildPremiseTree(filter: any) {
    if (filter.type === common.FilterType.CONDITION) {
      return data
        .find((field: any) => field.name === filter.fieldName)
        .values.map((value: any) => {
          try {
            return methods[filter.dataType][filter.method](
              value,
              filter.argument,
            )
          } catch {
            return false
          }
        })
    }
    return filter.filters.map(buildPremiseTree)
  }

  function shouldntDeleteRow(rowIndex: any, premises: any, group: any) {
    for (
      let conditionIndex = 0;
      conditionIndex < premises.length;
      ++conditionIndex
    ) {
      const currentPremise =
        premises[conditionIndex][0]?.constructor === Array
          ? shouldntDeleteRow(
              rowIndex,
              premises[conditionIndex],
              group.filters[conditionIndex],
            )
          : premises[conditionIndex][rowIndex]

      if (currentPremise === true) {
        switch (group.groupType) {
          case common.GroupType.AND:
            continue
          case common.GroupType.NOT_AND:
            return false
          case common.GroupType.OR:
            return true
          case common.GroupType.NOT_OR:
            continue
        }
      } else {
        switch (group.common.GroupType) {
          case common.GroupType.AND:
            return false
          case common.GroupType.NOT_AND:
            continue
          case common.GroupType.OR:
            continue
          case common.GroupType.NOT_OR:
            return true
        }
      }
    }

    switch (group.common.GroupType) {
      case common.GroupType.AND:
      case common.GroupType.NOT_AND:
        return true
      case common.GroupType.OR:
      case common.GroupType.NOT_OR:
        return false
    }
  }

  const premiseTree = buildPremiseTree(filter)

  for (
    let rowIndex = 0, rowsCount = data[0].values.length, deletionCount = 0;
    rowIndex < rowsCount;
    ++rowIndex
  ) {
    if (shouldntDeleteRow(rowIndex, premiseTree, filter) === false) {
      data.forEach((field: any) =>
        field.values.splice(rowIndex - deletionCount, 1),
      )
      ++deletionCount
    }
  }

  return data
}
