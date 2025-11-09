import { getServerSession } from "next-auth";
import { authOptions, getUserID } from "@/lib/auth";
import { GetMeUseCase } from "@/application/users/GetMe";
import { UpdateUserUseCase } from "@/application/users/UpdateUser";
import { DeleteUserUseCase } from "@/application/users/DeleteUser";
import { toDTO } from "@/interfaces/http/users/mappers";
import { resolveUserRepository } from "@/interfaces/http/users/repositoryProvider";
import {
  normalizeOptionalDateTime,
  normalizeOptionalTaskId,
  normalizeOptionalText,
  normalizeRequiredText,
} from "../normalizers";
import { AppError } from "@/lib/errors/AppError";

async function requireSessionUserId() {
  const session = await getServerSession(authOptions);
  const sessionUserId = await getUserID(session);
  if (!sessionUserId) {
    throw new Response(
      JSON.stringify({
        error: "Unauthorized: session user does not have a valid id",
      }),
      { status: 401 },
    );
  }
  return sessionUserId;
}

function ensureUserIdMatch(sessionId: string, requestedId: string) {
  if (sessionId !== requestedId) {
    throw new Response(
      JSON.stringify({
        error: "Forbidden: user id does not match session user id",
      }),
      { status: 403 },
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { userId: string } },
) {
  const requestedId = params?.userId;
  if (!requestedId) {
    return Response.json(
      { error: "Bad Request: invalid user id" },
      { status: 400 },
    );
  }

  try {
    const sessionId = await requireSessionUserId();
    ensureUserIdMatch(sessionId, requestedId);

    const repo = resolveUserRepository();
    const usecase = new GetMeUseCase(repo);
    const user = await usecase.execute({ userId: sessionId });
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    return Response.json(toDTO(user), { status: 200 });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error("Failed to get user:", error);
    return Response.json({ error: "Failed to get user" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { userId: string } },
) {
  const requestedId = params?.userId;
  if (!requestedId) {
    return Response.json(
      { error: "Bad Request: invalid user id" },
      { status: 400 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const { display_name, icon_path, current_task, current_task_time } =
    body ?? {};

  const hasDisplayName = Object.prototype.hasOwnProperty.call(
    body ?? {},
    "display_name",
  );
  const hasIconPath = Object.prototype.hasOwnProperty.call(
    body ?? {},
    "icon_path",
  );
  const hasCurrentTask = Object.prototype.hasOwnProperty.call(
    body ?? {},
    "current_task",
  );
  const hasCurrentTaskTime = Object.prototype.hasOwnProperty.call(
    body ?? {},
    "current_task_time",
  );

  try {
    const sessionId = await requireSessionUserId();
    ensureUserIdMatch(sessionId, requestedId);

    const repo = resolveUserRepository();
    const getMe = new GetMeUseCase(repo);
    const existing = await getMe.execute({ userId: sessionId });
    if (!existing) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const updateUseCase = new UpdateUserUseCase(repo);
    const existingPlain = toDTO(existing);
    const updated = await updateUseCase.execute({
      id: sessionId,
      displayName: hasDisplayName
        ? normalizeRequiredText("display_name", display_name)
        : existingPlain.displayName,
      iconPath: hasIconPath
        ? normalizeOptionalText("icon_path", icon_path)
        : existingPlain.iconPath,
      currentTask: hasCurrentTask
        ? normalizeOptionalTaskId("current_task", current_task)
        : existingPlain.currentTask,
      currentTaskTime: hasCurrentTaskTime
        ? normalizeOptionalDateTime("current_task_time", current_task_time)
        : existingPlain.currentTaskTime,
    });

    return Response.json(toDTO(updated), { status: 200 });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    if (error instanceof AppError) {
      if (error.code === "BadRequest") {
        return Response.json({ error: error.message }, { status: 400 });
      }
      if (error.code === "NotFound") {
        return Response.json({ error: error.message }, { status: 404 });
      }
    }
    const message = (error as Error)?.message ?? "";
    if (message.startsWith("BadRequest:")) {
      return Response.json({ error: message }, { status: 400 });
    }
    if (message === "UserNotFound") {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    console.error("Failed to update user:", error);
    return Response.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } },
) {
  const requestedId = params?.userId;
  if (!requestedId) {
    return Response.json(
      { error: "Bad Request: invalid user id" },
      { status: 400 },
    );
  }

  try {
    const sessionId = await requireSessionUserId();
    ensureUserIdMatch(sessionId, requestedId);

    const repo = resolveUserRepository();
    const deleteUsecase = new DeleteUserUseCase(repo);
    await deleteUsecase.execute({ id: sessionId });
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    const message = (error as Error)?.message ?? "";
    if (message === "UserNotFound") {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    console.error("Failed to delete user:", error);
    return Response.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
