import { BadRequestError } from "@/lib/errors/AppError";
import { toOptionalTrimmedString } from "@/lib/utils/string";

export function normalizeOptionalText(
  fieldName: string,
  value: unknown,
): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value !== "string") {
    throw new BadRequestError(`${fieldName} must be a string`);
  }
  return toOptionalTrimmedString(value);
}

export function normalizeRequiredText(
  fieldName: string,
  value: unknown,
): string {
  const normalized = normalizeOptionalText(fieldName, value);
  if (normalized === undefined) {
    throw new BadRequestError(`${fieldName} is required`);
  }
  return normalized;
}

export function normalizeOptionalTaskId(
  fieldName: string,
  value: unknown,
): number | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(numeric) || numeric < 0) {
    throw new BadRequestError(`${fieldName} must be a non-negative integer`);
  }
  return numeric;
}

export function normalizeOptionalDateTime(
  fieldName: string,
  value: unknown,
): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value !== "string") {
    throw new BadRequestError(`${fieldName} must be a string`);
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return undefined;
  }
  const parsed = Date.parse(trimmed);
  if (Number.isNaN(parsed)) {
    throw new BadRequestError(`${fieldName} must be a valid date string`);
  }
  return new Date(parsed).toISOString();
}
