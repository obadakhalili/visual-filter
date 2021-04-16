export enum FilterType {
  GROUP = "group",
  CONDITION = "condition",
}

export enum GroupType {
  AND = "and",
  NOT_AND = "not and",
  OR = "or",
  NOT_OR = "not or",
}

export enum DataType {
  NUMERIC = "numeric",
  NOMINAL = "nominal",
}

export function deepCopy(src: any): any {
  if (src.constructor === Object) {
    return Object.entries(src).reduce(
      (objCopy, [key, value]) => ({ ...objCopy, [key]: deepCopy(value) }),
      {},
    )
  }
  if (src.constructor === Array) {
    return src.map(deepCopy)
  }
  return src.valueOf()
}
