import { getServerSession } from "next-auth";
import { authOptions, getUserID } from "@/lib/auth";
import { AppError } from "@/lib/errors/AppError";
import { GetTaskByIdUseCase } from "@/application/tasks/GetTaskById";
import { UpdateTaskUseCase } from "@/application/tasks/UpdateTask";
import { DeleteTaskUseCase } from "@/application/tasks/DeleteTask";
import { toDTO } from "@/interfaces/http/tasks/mappers";
import { resolveTaskRepository } from "@/interfaces/http/tasks/repositoryProvider";
import {
  normalizeBoolean,
  normalizeNonNegativeInteger,
  normalizeOptionalDeadline,
  normalizePositiveInteger,
  normalizeTaskId,
  normalizeTaskName,
} from "../normalizers";

export async function GET(
  _request: Request,
  { params }: { params: { taskId: string } },
) {
  const session = await getServerSession(authOptions);
  const session_user_id = await getUserID(session);
  if (!session_user_id) {
    return Response.json(
      { error: "Unauthorized: session user does not have a valid id" },
      { status: 401 },
    );
  }

  try {
    const taskId = normalizeTaskId(params?.taskId);
    const repo = resolveTaskRepository();
    const usecase = new GetTaskByIdUseCase(repo);
    const task = await usecase.execute({ id: taskId, userId: session_user_id });
    if (!task) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }
    return Response.json(toDTO(task), { status: 200 });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.code === "BadRequest") {
        return Response.json({ error: error.message }, { status: 400 });
      }
      if (error.code === "NotFound") {
        return Response.json({ error: error.message }, { status: 404 });
      }
    }
    console.error("Failed to get task:", error);
    return Response.json({ error: "Failed to fetch task" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { taskId: string } },
) {
  const session = await getServerSession(authOptions);
  const session_user_id = await getUserID(session);
  if (!session_user_id) {
    return Response.json(
      { error: "Unauthorized: session user does not have a valid id" },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const { task_name, deadline, total_set, current_set, is_complete } =
    body ?? {};

  try {
    const taskId = normalizeTaskId(params?.taskId);
    const name = normalizeTaskName("task_name", task_name);
    const normalizedDeadline = normalizeOptionalDeadline("deadline", deadline);
    const totalSet = normalizePositiveInteger("total_set", total_set);
    const currentSet = normalizeNonNegativeInteger("current_set", current_set);
    const isComplete = normalizeBoolean("is_complete", is_complete);

    const repo = resolveTaskRepository();
    const usecase = new UpdateTaskUseCase(repo);
    const updated = await usecase.execute({
      id: taskId,
      userId: session_user_id,
      name,
      deadline: normalizedDeadline,
      totalSet,
      currentSet,
      isComplete,
    });
    return Response.json(toDTO(updated), { status: 200 });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.code === "BadRequest") {
        return Response.json({ error: error.message }, { status: 400 });
      }
      if (error.code === "NotFound") {
        return Response.json({ error: error.message }, { status: 404 });
      }
    }
    console.error("Failed to update task:", error);
    return Response.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { taskId: string } },
) {
  const session = await getServerSession(authOptions);
  const session_user_id = await getUserID(session);
  if (!session_user_id) {
    return Response.json(
      { error: "Unauthorized: session user does not have a valid id" },
      { status: 401 },
    );
  }

  try {
    const taskId = normalizeTaskId(params?.taskId);
    const repo = resolveTaskRepository();
    const usecase = new DeleteTaskUseCase(repo);
    await usecase.execute({ id: taskId, userId: session_user_id });
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.code === "BadRequest") {
        return Response.json({ error: error.message }, { status: 400 });
      }
      if (error.code === "NotFound") {
        return Response.json({ error: error.message }, { status: 404 });
      }
    }
    console.error("Failed to delete task:", error);
    return Response.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
