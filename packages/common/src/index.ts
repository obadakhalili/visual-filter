enum FilterType {
  GROUP = "group",
  CONDITION = "condition",
}

enum GroupType {
  AND = "and",
  NOT_AND = "not and",
  OR = "or",
  NOT_OR = "not or",
}

enum DataType {
  NUMERIC = "numeric",
  NOMINAL = "nominal",
}

function deepCopy(src: any): any {
  if (Object(src) !== src) {
    return src
  }
  if (src.constructor === Object) {
    return Object.entries(src).reduce(
      (objCopy, [key, value]) => ({ ...objCopy, [key]: deepCopy(value) }),
      {},
    )
  }
  return src.map(deepCopy)
}

export default {
  FilterType,
  GroupType,
  DataType,
  deepCopy,
}
