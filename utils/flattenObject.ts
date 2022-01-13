/**
 * Flatten a multidimensional object
 *
 * @see https://stackoverflow.com/a/55251598/3593896
 *
 * For example:
 *   flattenObject{ a: 1, b: { c: 2 } }
 * Returns:
 *   { a: 1, c: 2}
 */
export const flattenObject = (object) => {
  const flattened = {};

  for (const key of Object.keys(object)) {
    const value = object[key];

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value));
    } else {
      flattened[key] = value;
    }
  }

  return flattened;
};
