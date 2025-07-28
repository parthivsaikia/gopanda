type InputObject = Record<string, unknown>;
type OutputObject<T extends InputObject> = {
  [K in keyof T]: T[K] extends bigint ? string : T[K];
};

export function convertBigIntToString<T extends InputObject>(
  obj: T | null,
): OutputObject<T> | null {
  // Return null if the input is null
  if (obj === null) {
    return null;
  }

  const result = {} as OutputObject<T>;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      result[key] =
        typeof value === "bigint"
          ? (value.toString() as OutputObject<T>[typeof key])
          : (value as OutputObject<T>[typeof key]);
    }
  }

  return result;
}

// Define a type that represents valid JSON data
export type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSONValue }
  | JSONValue[];

export function deepConvertBigIntToString<T>(data: T): JSONValue {
  // <--- Change unknown to JSONValue
  if (typeof data === "bigint") {
    return String(data); // String is a valid JSONValue
  }

  if (data === null || typeof data !== "object") {
    // This covers string, number, boolean, null, undefined (if it somehow gets in, though it's not JSONValue)
    // If 'data' here is truly not an object (i.e., a primitive), it must be a string, number, boolean, or null
    // for this function to eventually return JSONValue.
    // We can cast here if we are absolutely sure, or refine the checks.
    return data as JSONValue; // Assuming T means data can be these primitives
  }

  if (Array.isArray(data)) {
    // The map function returns an array of JSONValue if deepConvertBigIntToString returns JSONValue
    return data.map((item) => deepConvertBigIntToString(item)) as JSONValue[];
  }

  const newObj: { [key: string]: JSONValue } = {}; // <--- Change unknown to JSONValue
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key as keyof T];
      // Recursively call, ensuring value is also JSONValue
      newObj[key] = deepConvertBigIntToString(value);
    }
  }

  return newObj as { [key: string]: JSONValue }; // Explicitly cast the final object
}
