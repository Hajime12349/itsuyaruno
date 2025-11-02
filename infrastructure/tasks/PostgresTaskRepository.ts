import { sql } from "@vercel/postgres";
import { query } from "@/infrastructure/db";
import { AppError, NotFoundError } from "@/lib/errors/AppError";
import { TaskEntity } from "../../domain/tasks/Task";
import type { TaskRepository } from "../../domain/tasks/TaskRepository";
import { TaskId } from "../../domain/tasks/valueObjects/TaskId";
import { TaskOwnerId } from "../../domain/tasks/valueObjects/TaskOwnerId";
import { TaskName } from "../../domain/tasks/valueObjects/TaskName";
import { TaskDeadline } from "../../domain/tasks/valueObjects/TaskDeadline";
import { TaskTotalSet } from "../../domain/tasks/valueObjects/TaskTotalSet";
import { TaskCurrentSet } from "../../domain/tasks/valueObjects/TaskCurrentSet";
import { TaskCompletionStatus } from "../../domain/tasks/valueObjects/TaskCompletionStatus";

function mapRowToEntity(row: any): TaskEntity {
  if (!row || typeof row !== "object") {
    throw new AppError("InternalError", "Task row is invalid");
  }

  const idValue = row.id;
  const deadlineValue = row.deadline;

  return TaskEntity.create({
    id:
      idValue !== null && idValue !== undefined
        ? TaskId.create(idValue)
        : undefined,
    userId: TaskOwnerId.create(row.user_id),
    name: TaskName.create(row.task_name),
    deadline:
      deadlineValue !== null && deadlineValue !== undefined
        ? TaskDeadline.create(deadlineValue)
        : undefined,
    totalSet: TaskTotalSet.create(row.total_set),
    currentSet: TaskCurrentSet.create(row.current_set),
    isComplete: TaskCompletionStatus.create(row.is_complete),
  });
}

function entityToPersistence(task: TaskEntity): {
  id?: number;
  userId: string;
  name: string;
  deadline?: string;
  totalSet: number;
  currentSet: number;
  isComplete: boolean;
} {
  return {
    id: task.id?.value,
    userId: task.userId.value,
    name: task.name.value,
    deadline: task.deadline?.value,
    totalSet: task.totalSet.value,
    currentSet: task.currentSet.value,
    isComplete: task.isComplete.value,
  };
}

function ensureRow<T>(
  result: { rows: T[]; rowCount?: number | null },
  notFoundMessage: string,
): T {
  const row = result.rows[0];
  if (!row || result.rowCount === 0) {
    throw new NotFoundError(notFoundMessage);
  }
  return row;
}

export class PostgresTaskRepository implements TaskRepository {
  async findAllByUser(
    userId: TaskOwnerId,
    includeComplete: boolean,
  ): Promise<TaskEntity[]> {
    if (process.env.NODE_ENV === "production") {
      const result = includeComplete
        ? await sql`SELECT * FROM tasks WHERE user_id = ${userId.value} ORDER BY id ASC`
        : await sql`SELECT * FROM tasks WHERE user_id = ${userId.value} AND is_complete = false ORDER BY id ASC`;
      return result.rows.map(mapRowToEntity);
    }
    const result = await query(
      "SELECT * FROM tasks WHERE user_id = $1 " +
        (includeComplete ? "" : "AND is_complete = false ") +
        "ORDER BY id ASC",
      [userId.value],
    );
    return result.rows.map(mapRowToEntity);
  }

  async findByIdForUser(
    id: TaskId,
    userId: TaskOwnerId,
  ): Promise<TaskEntity | null> {
    if (process.env.NODE_ENV === "production") {
      const result =
        await sql`SELECT * FROM tasks WHERE id = ${id.value} AND user_id = ${userId.value}`;
      return result.rows[0] ? mapRowToEntity(result.rows[0]) : null;
    }
    const result = await query(
      "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
      [id.value, userId.value],
    );
    return result.rows[0] ? mapRowToEntity(result.rows[0]) : null;
  }

  async create(task: TaskEntity): Promise<TaskEntity> {
    const persistence = entityToPersistence(task);
    if (process.env.NODE_ENV === "production") {
      const result =
        await sql`INSERT INTO tasks (user_id, task_name, deadline, total_set, current_set, is_complete) VALUES(${persistence.userId}, ${persistence.name}, ${persistence.deadline}, ${persistence.totalSet}, ${persistence.currentSet}, ${persistence.isComplete}) RETURNING *`;
      return mapRowToEntity(ensureRow(result, "Task not found"));
    }
    const result = await query(
      "INSERT INTO tasks (user_id, task_name, deadline, total_set, current_set, is_complete) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        persistence.userId,
        persistence.name,
        persistence.deadline,
        persistence.totalSet,
        persistence.currentSet,
        persistence.isComplete,
      ],
    );
    return mapRowToEntity(ensureRow(result, "Task not found"));
  }

  async update(task: TaskEntity): Promise<TaskEntity> {
    const persistence = entityToPersistence(task);
    if (persistence.id === undefined) {
      throw new AppError("InternalError", "Task id is required for update");
    }
    if (process.env.NODE_ENV === "production") {
      const result =
        await sql`UPDATE tasks SET task_name = ${persistence.name}, deadline = ${persistence.deadline}, total_set = ${persistence.totalSet}, current_set = ${persistence.currentSet}, is_complete = ${persistence.isComplete} WHERE id = ${persistence.id} AND user_id = ${persistence.userId} RETURNING *`;
      return mapRowToEntity(ensureRow(result, "Task not found"));
    }
    const result = await query(
      "UPDATE tasks SET task_name = $1, deadline = $2, total_set = $3, current_set = $4, is_complete = $5 WHERE id = $6 AND user_id = $7 RETURNING *",
      [
        persistence.name,
        persistence.deadline,
        persistence.totalSet,
        persistence.currentSet,
        persistence.isComplete,
        persistence.id,
        persistence.userId,
      ],
    );
    return mapRowToEntity(ensureRow(result, "Task not found"));
  }

  async delete(id: TaskId, userId: TaskOwnerId): Promise<void> {
    if (process.env.NODE_ENV === "production") {
      const result =
        await sql`DELETE FROM tasks WHERE id = ${id.value} AND user_id = ${userId.value}`;
      if ((result.rowCount ?? 0) === 0) {
        throw new NotFoundError("Task not found");
      }
      return;
    }
    const result = await query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2",
      [id.value, userId.value],
    );
    if ((result.rowCount ?? 0) === 0) {
      throw new NotFoundError("Task not found");
    }
  }
}
