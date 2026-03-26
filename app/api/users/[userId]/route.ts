import { getServerSession } from "next-auth";
import { authOptions, getUserID } from "@/lib/auth";
import { GetMeUseCase } from "@/application/users/GetMe";
import { UpdateUserUseCase } from "@/application/users/UpdateUser";
import { DeleteUserUseCase } from "@/application/users/DeleteUser";
import { UserDataModelBuilder } from "@/application/users/UserDataModelMapper";
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
      { status: 401 }
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
      { status: 403 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const requestedId = params?.userId;
  if (!requestedId) {
    return Response.json(
      { error: "Bad Request: invalid user id" },
      { status: 400 }
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

    const userBuilder = new UserDataModelBuilder();
    user.notify(userBuilder);
    return Response.json(userBuilder.build(), { status: 200 });
    
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
  { params }: { params: { userId: string } }
) {
  const requestedId = params?.userId;
  if (!requestedId) {
    return Response.json(
      { error: "Bad Request: invalid user id" },
      { status: 400 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const { displayName, iconPath, currentTask, currentTaskTime } =
    body ?? {};

  const hasDisplayName = Object.prototype.hasOwnProperty.call(
    body ?? {},
    "displayName"
  );
  const hasIconPath = Object.prototype.hasOwnProperty.call(
    body ?? {},
    "iconPath"
  );
  const hasCurrentTask = Object.prototype.hasOwnProperty.call(
    body ?? {},
    "currentTask"
  );
  const hasCurrentTaskTime = Object.prototype.hasOwnProperty.call(
    body ?? {},
    "currentTaskTime"
  );

  try {
    const sessionId = await requireSessionUserId();
    ensureUserIdMatch(sessionId, requestedId);

    const repo = resolveUserRepository();
    const getMe = new GetMeUseCase(repo);
    const existingUser = await getMe.execute({ userId: sessionId });
    if (!existingUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    const existingBuilder = new UserDataModelBuilder();
    existingUser.notify(existingBuilder);
    const rawExistingUser = existingBuilder.build();
    
    const updateUseCase = new UpdateUserUseCase(repo);
    const updatedUser = await updateUseCase.execute({
      id: sessionId,
      displayName: hasDisplayName
        ? normalizeRequiredText("displayName", displayName)
        : rawExistingUser.displayName,
      iconPath: hasIconPath
        ? normalizeOptionalText("iconPath", iconPath)
        : rawExistingUser.iconPath,
      currentTask: hasCurrentTask
        ? normalizeOptionalTaskId("currentTask", currentTask)
        : rawExistingUser.currentTask,
      currentTaskTime: hasCurrentTaskTime
        ? normalizeOptionalDateTime("currentTaskTime", currentTaskTime)
        : rawExistingUser.currentTaskTime,
    });

    const updatedBuilder = new UserDataModelBuilder();
    updatedUser.notify(updatedBuilder);
    return Response.json(updatedBuilder.build(), { status: 200 });
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

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const requestedId = params?.userId;
  if (!requestedId) {
    return Response.json(
      { error: "Bad Request: invalid user id" },
      { status: 400 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const { displayName, iconPath, currentTask, currentTaskTime } =
    body ?? {};

  const hasDisplayName = Object.prototype.hasOwnProperty.call(
    body ?? {},
    "displayName"
  );
  const hasIconPath = Object.prototype.hasOwnProperty.call(
    body ?? {},
    "iconPath"
  );
  const hasCurrentTask = Object.prototype.hasOwnProperty.call(
    body ?? {},
    "currentTask"
  );
  const hasCurrentTaskTime = Object.prototype.hasOwnProperty.call(
    body ?? {},
    "currentTaskTime"
  );

  try {
    const sessionId = await requireSessionUserId();
    ensureUserIdMatch(sessionId, requestedId);

    const repo = resolveUserRepository();
    const getMe = new GetMeUseCase(repo);
    const existingUser = await getMe.execute({ userId: sessionId });
    if (!existingUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    const existingBuilder = new UserDataModelBuilder();
    existingUser.notify(existingBuilder);
    const rawExistingUser = existingBuilder.build();
    
    // For PATCH, we only normalize and update what is explicitly provided.
    // We intentionally reuse normalizeOptionalText and ignore normalizeRequiredText 
    // to prevent validation errors for displayName if it's not being updated,
    // although technically displayName should be normalized with OptionalText if it's allowed
    // to be updated partially.
    
    const updateUseCase = new UpdateUserUseCase(repo);
    const updatedUser = await updateUseCase.execute({
      id: sessionId,
      displayName: hasDisplayName
         // If a client sends 'displayName' in PATCH, we still treat it as a required non-empty string for the domain
        ? normalizeRequiredText("displayName", displayName)
        : rawExistingUser.displayName,
      iconPath: hasIconPath
        ? normalizeOptionalText("iconPath", iconPath)
        : rawExistingUser.iconPath,
      currentTask: hasCurrentTask
        ? normalizeOptionalTaskId("currentTask", currentTask)
        : rawExistingUser.currentTask,
      currentTaskTime: hasCurrentTaskTime
        ? normalizeOptionalDateTime("currentTaskTime", currentTaskTime)
        : rawExistingUser.currentTaskTime,
    });

    const updatedBuilder = new UserDataModelBuilder();
    updatedUser.notify(updatedBuilder);
    return Response.json(updatedBuilder.build(), { status: 200 });
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
  { params }: { params: { userId: string } }
) {
  const requestedId = params?.userId;
  if (!requestedId) {
    return Response.json(
      { error: "Bad Request: invalid user id" },
      { status: 400 }
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
