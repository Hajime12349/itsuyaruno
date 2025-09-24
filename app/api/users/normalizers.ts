export function normalizeOptionalText(fieldName: string, value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value !== 'string') {
    throw new Error(`BadRequest: ${fieldName}`);
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function normalizeOptionalTaskId(fieldName: string, value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const numeric = typeof value === 'number' ? value : Number(value);
  if (!Number.isInteger(numeric) || numeric < 0) {
    throw new Error(`BadRequest: ${fieldName}`);
  }
  return numeric;
}

export function normalizeOptionalDateTime(fieldName: string, value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value !== 'string') {
    throw new Error(`BadRequest: ${fieldName}`);
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return undefined;
  }
  const parsed = Date.parse(trimmed);
  if (Number.isNaN(parsed)) {
    throw new Error(`BadRequest: ${fieldName}`);
  }
  return new Date(parsed).toISOString();
}
