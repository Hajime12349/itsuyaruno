import { getServerSession } from "next-auth";
import { authOptions, getUserID } from "@/lib/auth";
import { GetTagsUseCase } from "../../../application/tags/GetTags";
import { CreateTagUseCase } from "../../../application/tags/CreateTag";
import { toDTO } from "../../../interfaces/http/tags/mappers";
import { resolveTagRepository } from "@/interfaces/http/tags/repositoryProvider";
import { AppError } from "@/lib/errors/AppError";
import { normalizeTagName } from "./normalizers";

export async function GET(_req: Request) {
  const session = await getServerSession(authOptions);
  const session_user_id = await getUserID(session);
  if (!session_user_id) {
    return Response.json(
      { error: "Unauthorized: session user does not have a valid id" },
      { status: 401 },
    );
  }

  try {
    const repo = resolveTagRepository();
    const usecase = new GetTagsUseCase(repo);
    const tags = await usecase.execute();
    return Response.json(tags.map(toDTO), { status: 200 });
  } catch (error) {
    if (error instanceof AppError && error.code === "BadRequest") {
      return Response.json({ error: error.message }, { status: 400 });
    }
    console.error("Failed to fetch tags:", error);
    return Response.json({ error: "Failed to fetch tags" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const session_user_id = await getUserID(session);
  if (!session_user_id) {
    return Response.json(
      { error: "Unauthorized: session user does not have a valid id" },
      { status: 401 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const { tag_name } = body ?? {};

  try {
    const normalizedName = normalizeTagName("tag_name", tag_name);

    const repo = resolveTagRepository();
    const usecase = new CreateTagUseCase(repo);
    const created = await usecase.execute({ name: normalizedName });
    return Response.json(toDTO(created), { status: 201 });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.code === "BadRequest") {
        return Response.json({ error: error.message }, { status: 400 });
      }
    }
    console.error("Failed to add tag:", error);
    return Response.json({ error: "Failed to add tag" }, { status: 500 });
  }
}
