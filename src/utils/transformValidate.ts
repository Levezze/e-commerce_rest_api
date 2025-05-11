import { z } from "zod";
import camelcaseKeys from "camelcase-keys";


export const transformValidate = <T extends z.ZodTypeAny>(
  input: unknown,
  schema: T
): z.infer<T> => {
  const normalize = (data: any) =>
    JSON.parse(
      JSON.stringify(data, (_, value) =>
        value instanceof Date ? value.toISOString() : value
      ));

  if (typeof input !== "object" || input === null) {
    throw new Error("Input must be an object or array of objects");
  }

  const obj = input as Record<string, unknown> | readonly Record<string, unknown>[];

  const transformed = Array.isArray(obj)
    ? obj.map(i => normalize(camelcaseKeys(i, { deep: true })))
    : normalize(camelcaseKeys(obj, { deep: true }));

  return schema.parse(transformed);
};

