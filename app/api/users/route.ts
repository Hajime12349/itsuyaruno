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
  const session_user_id = await getUserID(session);
  if (!session_user_id) {
    return new Response(
      JSON.stringify({
        error: "Unauthorized: session user does not have a valid id",
      }),
      { status: 401 }
    );
  }

  try {
    const repo = resolveUserRepository();
    const getUsecase = new GetMeUseCase(repo);
    const user = await getUsecase.execute({ userId: session_user_id });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }
    
    const userBuilder = new UserDataModelBuilder();
    user.notify(userBuilder);
    return new Response(JSON.stringify(userBuilder.build()), { status: 200 });
  } catch (error) {
    console.error("Database query failed:", error);
    if (error instanceof AppError) {
      if (error.code === "BadRequest") {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
        });
      }
      if (error.code === "NotFound") {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 404,
        });
      }
    }
    const message = (error as Error)?.message ?? "Unknown error";
    return new Response(
      JSON.stringify({ error: "Failed to get user", detail: message }),
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const session_user_id = await getUserID(session);
  if (!session_user_id) {
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

  const id = requestedId ?? session_user_id;

  if (id !== session_user_id) {
    return new Response(
      JSON.stringify({
        error: "Forbidden: user id does not match session user id",
      }),
      { status: 403 }
    );
  }

  try {
    const repo = resolveUserRepository();
    const createUsecase = new CreateUserUseCase(repo);
    const created = await createUsecase.execute({
      id,
      displayName: normalizeRequiredText("display_name", display_name),
      iconPath: normalizeOptionalText("icon_path", icon_path),
      currentTask: normalizeOptionalTaskId("current_task", current_task),
      currentTaskTime: normalizeOptionalDateTime(
        "current_task_time",
        current_task_time
      ),
    });
    return new Response(JSON.stringify(created), { status: 201 });
  } catch (error) {
    console.error("Database query failed:", error);
    if (error instanceof AppError) {
      if (error.code === "BadRequest") {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
        });
      }
      if (error.code === "NotFound") {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 404,
        });
      }
    }
    const message = (error as Error)?.message ?? "Unknown error";
    return new Response(
      JSON.stringify({ error: "Failed to add user", detail: message }),
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  const session_user_id = await getUserID(session);
  if (!session_user_id) {
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

  const id = requestedId ?? session_user_id;

  if (id !== session_user_id) {
    return new Response(
      JSON.stringify({
        error: "Forbidden: user id does not match session user id",
      }),
      { status: 403 }
    );
  }

  const hasDisplayName = Object.prototype.hasOwnProperty.call(
    body ?? {},
    "display_name"
  );
  const hasIconPath = Object.prototype.hasOwnProperty.call(
    body ?? {},
    "icon_path"
  );
  const hasCurrentTask = Object.prototype.hasOwnProperty.call(
    body ?? {},
    "current_task"
  );
  const hasCurrentTaskTime = Object.prototype.hasOwnProperty.call(
    body ?? {},
    "current_task_time"
  );

  try {
    const repo = resolveUserRepository();
    const getMe = new GetMeUseCase(repo);
    const existingUser = await getMe.execute({ userId: id });
    if (!existingUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }
    const existingUserBuilder = new UserDataModelBuilder();
    existingUser.notify(existingUserBuilder);
    const existingPlain = existingUserBuilder.build();

    const updateUseCase = new UpdateUserUseCase(repo);
    const updatedUser = await updateUseCase.execute({
      id,
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

    const updateUserBuilder = new UserDataModelBuilder();
    updatedUser.notify(updateUserBuilder);
    return new Response(JSON.stringify(updateUserBuilder.build()), { status: 200 });
  } catch (error) {
    console.error("Database query failed:", error);
    if (error instanceof AppError) {
      if (error.code === "BadRequest") {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
        });
      }
      if (error.code === "NotFound") {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 404,
        });
      }
    }
    const legacyMessage = (error as Error)?.message;
    if (
      legacyMessage === "UserNotFound" ||
      legacyMessage === "User not found"
    ) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }
    const message = legacyMessage ?? "Unknown error";
    return new Response(
      JSON.stringify({ error: "Failed to update user", detail: message }),
      { status: 500 }
    );
  }
}
