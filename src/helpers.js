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
