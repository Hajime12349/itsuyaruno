import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions, getUserID } from "@/lib/auth";
import { GetTasksUseCase } from "../../../application/tasks/GetTasks";
import { CreateTaskUseCase } from "../../../application/tasks/CreateTask";
import { TaskDataModelBuilder } from "@/application/tasks/TaskDataModelMapper";
import { resolveTaskRepository } from "@/interfaces/http/tasks/repositoryProvider";
import { AppError } from "@/lib/errors/AppError";
import {
  normalizeBoolean,
  normalizeIncludeComplete,
  normalizeNonNegativeInteger,
  normalizeOptionalDeadline,
  normalizePositiveInteger,
  normalizeTaskName,
} from "./normalizers";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const sessionUserId = await getUserID(session);
  if (!sessionUserId) {
    return Response.json(
      { error: { code: "Unauthorized", message: "session user does not have a valid id" } },
      { status: 401 },
    );
  }

  try {
    const includeComplete = normalizeIncludeComplete(
      req.nextUrl.searchParams.get("include_complete"),
    );
    const taskRepository = resolveTaskRepository();
    const usecase = new GetTasksUseCase(taskRepository);
    const entities = await usecase.execute({
      userId: sessionUserId,
      includeComplete: includeComplete,
    });
    const plainTasks = entities.map((task) => {
      const taskBuilder = new TaskDataModelBuilder();
      task.notify(taskBuilder);
      return taskBuilder.build();
    });
    return Response.json(plainTasks, { status: 200 });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.code === "BadRequest") {
        return Response.json({ error: { code: error.code, message: error.message } }, { status: 400 });
      }
    }
    console.error("Failed to fetch tasks:", error);
    return Response.json({ error: { code: "InternalError", message: "Failed to fetch tasks" } }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const sessionUserId = await getUserID(session);
  if (!sessionUserId) {
    return Response.json(
      { error: { code: "Unauthorized", message: "session user does not have a valid id" } },
      { status: 401 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const { task_name, deadline, total_set, current_set, is_complete } =
    body ?? {};

  try {
    const name = normalizeTaskName("task_name", task_name);
    const normalizedDeadline = normalizeOptionalDeadline("deadline", deadline);
    const totalSet = normalizePositiveInteger("total_set", total_set);
    const currentSet = normalizeNonNegativeInteger("current_set", current_set);
    const isComplete = normalizeBoolean("is_complete", is_complete);

    const taskRepository = resolveTaskRepository();
    const taskCreateUseCase = new CreateTaskUseCase(taskRepository);
    const created = await taskCreateUseCase.execute({
      userId: sessionUserId,
      name,
      deadline: normalizedDeadline,
      totalSet,
      currentSet,
      isComplete,
    });
    const taskBuilder = new TaskDataModelBuilder();
    created.notify(taskBuilder);
    return Response.json(taskBuilder.build(), { status: 201 });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.code === "BadRequest") {
        return Response.json({ error: { code: error.code, message: error.message } }, { status: 400 });
      }
    }
    console.error("Failed to add task:", error);
    return Response.json({ error: { code: "InternalError", message: "Failed to add task" } }, { status: 500 });
  }
}
