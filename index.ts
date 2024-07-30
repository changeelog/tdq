type Primitive = string | number | boolean | null | undefined;
type DeepEqualValue = Primitive | object | any[];

export function deepEqual<T extends DeepEqualValue>(a: T, b: T): boolean {
  if (a === b) return true;

  if (a == null || b == null) return false;

  if (typeof a !== typeof b) return false;

  if (isPrimitive(a) || isPrimitive(b)) return a === b;

  if (Array.isArray(a) && Array.isArray(b)) {
    return arraysEqual(a, b);
  }

  if (typeof a === "object" && typeof b === "object") {
    return objectsEqual(a as object, b as object);
  }

  return false;
}

function isPrimitive(value: unknown): value is Primitive {
  return (
    value === null ||
    ["string", "number", "boolean", "undefined"].includes(typeof value)
  );
}

function arraysEqual<T extends any[]>(a: T, b: T): boolean {
  if (a.length !== b.length) return false;
  return a.every((item, index) => deepEqual(item, b[index]));
}

function objectsEqual(a: object, b: object): boolean {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  return keysA.every((key) => deepEqual((a as any)[key], (b as any)[key]));
}
