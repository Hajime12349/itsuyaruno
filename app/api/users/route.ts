import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserID } from "@/lib/auth";
import { GetMeUseCase } from "../../../application/users/GetMe";
import { CreateUserUseCase } from "../../../application/users/CreateUser";
import { UpdateUserUseCase } from "../../../application/users/UpdateUser";
import { UserDataModelBuilder } from "../../../application/users/UserDataModelMapper";
import { resolveUserRepository } from "@/interfaces/http/users/repositoryProvider";
import {
  normalizeOptionalDateTime,
  normalizeOptionalTaskId,
  normalizeOptionalText,
  normalizeRequiredText,
} from "./normalizers";
import { AppError } from "@/lib/errors/AppError";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const sessionUserId = await getUserID(session);
  if (!sessionUserId) {
    return new Response(
      JSON.stringify({
        error: { code: "Unauthorized", message: "Session user does not have a valid id" },
      }),
      { status: 401 }
    );
  }

  try {
    const userRepository = resolveUserRepository();
    const getUsecase = new GetMeUseCase(userRepository);
    const user = await getUsecase.execute({ userId: sessionUserId });
    if (!user) {
      return new Response(JSON.stringify({ detail: "User not found"  }), {
        status: 404,
      });
    }

    const userBuilder = new UserDataModelBuilder();
    user.notify(userBuilder);
    return new Response(JSON.stringify(userBuilder.build()), { status: 200 });
  } catch (error) {
    console.error("Unhandled error in GetMe API:", error);

    if (error instanceof AppError) {
      const statusMap: Record<string, number> = {
        BadRequest: 400,
        NotFound: 404,
      };
      const status = statusMap[error.code] ?? 500;
      return new Response(JSON.stringify({ error: { code: error.code, message: error.message } }), {
        status,
      });
    }

    const message = (error as Error)?.message ?? "Unknown error";
    return new Response(JSON.stringify({ error: { code: "InternalError", message } }), { status: 500 });
  }

}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const sessionUserId = await getUserID(session);
  if (!sessionUserId) {
    return new Response(
      JSON.stringify({
        error: { code: "Unauthorized", message: "Session user does not have a valid id" },
      }),
      { status: 401 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const {
    id: requestedId,
    displayName,
    iconPath,
    currentTask,
    currentTaskTime,
  } = body ?? {};

  const id = requestedId ?? sessionUserId;

  if (id !== sessionUserId) {
    return new Response(
      JSON.stringify({
        error: { code: "Forbidden", message: "User id does not match session user id" },
      }),
      { status: 403 }
    );
  }

  try {
    const userRepository = resolveUserRepository();
    const createUsecase = new CreateUserUseCase(userRepository);
    const created = await createUsecase.execute({
      id,
      displayName: normalizeRequiredText("displayName", displayName),
      iconPath: normalizeOptionalText("iconPath", iconPath),
      currentTask: normalizeOptionalTaskId("currentTask", currentTask),
      currentTaskTime: normalizeOptionalDateTime(
        "currentTaskTime",
        currentTaskTime
      ),
    });
    return new Response(JSON.stringify(created), { status: 201 });
  } catch (error) {
    console.error("Database query failed:", error);
    if (error instanceof AppError) {
      if (error.code === "BadRequest") {
        return new Response(JSON.stringify({ error: { code: error.code, message: error.message } }), {
          status: 400,
        });
      }
      if (error.code === "NotFound") {
        return new Response(JSON.stringify({ error: { code: error.code, message: error.message } }), {
          status: 404,
        });
      }
    }
    const message = (error as Error)?.message ?? "Unknown error";
    return new Response(
      JSON.stringify({ error: { code: "InternalError", message } }),
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  const sessionUserId = await getUserID(session);
  if (!sessionUserId) {
    return new Response(
      JSON.stringify({
        error: "Unauthorized: session user does not have a valid id",
      }),
      { status: 401 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const {
    id: requestedId,
    display_name,
    icon_path,
    current_task,
    current_task_time,
  } = body ?? {};

  const id = requestedId ?? sessionUserId;

  if (id !== sessionUserId) {
    return new Response(
      JSON.stringify({
        error: { code: "Forbidden", message: "user id does not match session user id" },
      }),
      { status: 403 }
    );
  }

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
    const userRepository = resolveUserRepository();
    const getMe = new GetMeUseCase(userRepository);
    const existingUser = await getMe.execute({ userId: id });
    if (!existingUser) {
      return new Response(JSON.stringify({ error: { code: "NotFound", message: "User not found" } }), {
        status: 404,
      });
    }
    const existingUserBuilder = new UserDataModelBuilder();
    existingUser.notify(existingUserBuilder);
    const existingUserPlain = existingUserBuilder.build();

    const updateUseCase = new UpdateUserUseCase(userRepository);
    const updatedUser = await updateUseCase.execute({
      id,
      displayName: hasDisplayName
        ? normalizeRequiredText("display_name", display_name)
        : existingUserPlain.displayName,
      iconPath: hasIconPath
        ? normalizeOptionalText("icon_path", icon_path)
        : existingUserPlain.iconPath,
      currentTask: hasCurrentTask
        ? normalizeOptionalTaskId("current_task", current_task)
        : existingUserPlain.currentTask,
      currentTaskTime: hasCurrentTaskTime
        ? normalizeOptionalDateTime("current_task_time", current_task_time)
        : existingUserPlain.currentTaskTime,
    });

    const updateUserBuilder = new UserDataModelBuilder();
    updatedUser.notify(updateUserBuilder);
    return new Response(JSON.stringify(updateUserBuilder.build()), { status: 200 });
  } catch (error) {
    console.error("Database query failed:", error);
    if (error instanceof AppError) {
      if (error.code === "BadRequest") {
        return new Response(JSON.stringify({ error: { code: "BadRequest", message: error.message } }), {
          status: 400,
        });
      }
      if (error.code === "NotFound") {
        return new Response(JSON.stringify({ error: { code: "NotFound", message: error.message } }), {
          status: 404,
        });
      }
    }
    const legacyMessage = (error as Error)?.message;
    if (
      legacyMessage === "UserNotFound" ||
      legacyMessage === "User not found"
    ) {
      return new Response(JSON.stringify({ error: { code: "NotFound", message: "User not found" } }), {
        status: 404,
      });
    }
    const message = legacyMessage ?? "Unknown error";
    return new Response(
      JSON.stringify({ error: { code: "InternalError", message: "Failed to update user", detail: message } }),
      { status: 500 }
    );
  }
}
