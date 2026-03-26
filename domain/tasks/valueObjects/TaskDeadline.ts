import { BadRequestError } from "@/lib/errors/AppError";

export class TaskDeadline {
  private constructor(private readonly _value: Date) {}

  static create(value: string | Date): TaskDeadline {
    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) {
        throw new BadRequestError("TaskDeadline must be a valid date");
      }
      return new TaskDeadline(new Date(value.getTime()));
    }
    if (typeof value !== "string") {
      throw new BadRequestError(
        "TaskDeadline must be provided as a string or Date",
      );
    }
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      throw new BadRequestError("TaskDeadline must not be empty");
    }
    const parsed = Date.parse(trimmed);
    if (Number.isNaN(parsed)) {
      throw new BadRequestError("TaskDeadline must be a valid date string");
    }
    return new TaskDeadline(new Date(parsed));
  }

  get value(): string {
    return this._value.toISOString();
  }

  get asDate(): Date {
    return new Date(this._value.getTime());
  }
}
