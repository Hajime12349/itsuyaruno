import { BadRequestError } from "@/lib/errors/AppError";

export class TaskCompletionStatus {
  private constructor(private readonly _value: boolean) {}

  static create(value: boolean): TaskCompletionStatus {
    if (typeof value !== "boolean") {
      throw new BadRequestError("TaskCompletionStatus must be a boolean");
    }
    return new TaskCompletionStatus(value);
  }

  get value(): boolean {
    return this._value;
  }
}
