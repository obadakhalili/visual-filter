import { FilterType, GroupType } from "@/VueVisualFilter/index.vue"

export function createEnum(obj) {
  return Object.freeze(obj)
}

export function deepCopy(src) {
  if (Object(src) !== src) {
    return src
  } else if (src.constructor === Object) {
    return Object.entries(src).reduce(
      (objCopy, [key, value]) => ({ ...objCopy, [key]: deepCopy(value) }),
      {}
    )
  } else {
    return src.map(deepCopy)
  }
}

export function applyFilter(filter, methods, data) {
  function buildPremiseTree(filter) {
    if (filter.type === FilterType.CONDITION) {
      return data
        .find((field) => field.name === filter.fieldName)
        .values.map((value) => {
          try {
            return methods[filter.dataType][filter.method](
              value,
              filter.argument
            )
          } catch {
            return false
          }
        })
    } else {
      return filter.filters.map((childFilter) => buildPremiseTree(childFilter))
    }
  }

  function shouldntDeleteRow(rowIndex, premises, group) {
    for (
      let conditionIndex = 0;
      conditionIndex < premises.length;
      ++conditionIndex
    ) {
      let currentPremise =
        premises[conditionIndex][0]?.constructor === Array
          ? shouldntDeleteRow(
              rowIndex,
              premises[conditionIndex],
              group.filters[conditionIndex]
            )
          : premises[conditionIndex][rowIndex]

      if (currentPremise === true) {
        switch (group.groupType) {
          case GroupType.AND:
            continue
          case GroupType.NOT_AND:
            return false
          case GroupType.OR:
            return true
          case GroupType.NOT_OR:
            continue
        }
      } else {
        switch (group.groupType) {
          case GroupType.AND:
            return false
          case GroupType.NOT_AND:
            continue
          case GroupType.OR:
            continue
          case GroupType.NOT_OR:
            return true
        }
      }
    }

    switch (group.groupType) {
      case GroupType.AND:
      case GroupType.NOT_AND:
        return true
      case GroupType.OR:
      case GroupType.NOT_OR:
        return false
    }
  }

  const premiseTree = buildPremiseTree(filter)

  for (
    let rowIndex = 0, rowsCount = data[0].values.length;
    rowIndex < rowsCount;
    ++rowIndex
  ) {
    if (shouldntDeleteRow(rowIndex, premiseTree, filter) === false) {
      data.forEach((field) => field.values.splice(rowIndex, 1))
    }
  }

  return data
}
