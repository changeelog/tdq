type Primitive = string | number | boolean | null | undefined;
type DeepEqualValue =
  | Primitive
  | object
  | any[]
  | Date
  | RegExp
  | Map<any, any>
  | Set<any>;

export function deepEqual<T extends DeepEqualValue>(a: T, b: T): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;

  if (isPrimitive(a) || isPrimitive(b)) return a === b;
  if (Array.isArray(a) && Array.isArray(b)) return arraysEqual(a, b);
  if (a instanceof Date && b instanceof Date) return datesEqual(a, b);
  if (a instanceof RegExp && b instanceof RegExp) return regexEqual(a, b);
  if (a instanceof Map && b instanceof Map) return mapsEqual(a, b);
  if (a instanceof Set && b instanceof Set) return setsEqual(a, b);
  if (typeof a === "object" && typeof b === "object")
    return objectsEqual(a as object, b as object);

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

function datesEqual(a: Date, b: Date): boolean {
  return a.getTime() === b.getTime();
}

function regexEqual(a: RegExp, b: RegExp): boolean {
  return a.source === b.source && a.flags === b.flags;
}

function mapsEqual<K, V extends DeepEqualValue>(
  a: Map<K, V>,
  b: Map<K, V>
): boolean {
  if (a.size !== b.size) return false;
  for (const [key, value] of a) {
    if (!b.has(key) || !deepEqual(value, b.get(key)!)) return false;
  }
  return true;
}

function setsEqual<T>(a: Set<T>, b: Set<T>): boolean {
  if (a.size !== b.size) return false;
  for (const item of a) {
    if (!b.has(item)) return false;
  }
  return true;
}

function objectsEqual(a: object, b: object): boolean {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  return keysA.every((key) => deepEqual((a as any)[key], (b as any)[key]));
}
