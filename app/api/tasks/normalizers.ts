import { BadRequestError } from "@/lib/errors/AppError";

export function normalizeIncludeComplete(value: string | null): boolean {
  if (value === null) return false;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new BadRequestError('include_complete must be "true" or "false"');
}

export function normalizeTaskName(fieldName: string, value: unknown): string {
  if (typeof value !== "string") {
    throw new BadRequestError(`${fieldName} must be a string`);
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new BadRequestError(`${fieldName} must not be empty`);
  }
  return trimmed;
}

export function normalizeOptionalDeadline(
  fieldName: string,
  value: unknown,
): string | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  if (typeof value !== "string") {
    throw new BadRequestError(`${fieldName} must be a string`);
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function normalizePositiveInteger(
  fieldName: string,
  value: unknown,
): number {
  const numeric =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;
  if (!Number.isInteger(numeric) || numeric < 1) {
    throw new BadRequestError(
      `${fieldName} must be an integer greater than or equal to 1`,
    );
  }
  return numeric;
}

export function normalizeNonNegativeInteger(
  fieldName: string,
  value: unknown,
): number {
  const numeric =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;
  if (!Number.isInteger(numeric) || numeric < 0) {
    throw new BadRequestError(
      `${fieldName} must be an integer greater than or equal to 0`,
    );
  }
  return numeric;
}

export function normalizeBoolean(fieldName: string, value: unknown): boolean {
  if (typeof value !== "boolean") {
    throw new BadRequestError(`${fieldName} must be a boolean`);
  }
  return value;
}

export function normalizeTaskId(value: string | string[] | undefined): number {
  if (typeof value !== "string") {
    throw new BadRequestError("task id must be a positive integer");
  }
  const numeric = Number(value);
  if (!Number.isInteger(numeric) || numeric < 1) {
    throw new BadRequestError("task id must be a positive integer");
  }
  return numeric;
}
