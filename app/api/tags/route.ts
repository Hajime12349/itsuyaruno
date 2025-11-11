import { getServerSession } from "next-auth";
import { authOptions, getUserID } from "@/lib/auth";
import { GetTagsUseCase } from "../../../application/tags/GetTags";
import { CreateTagUseCase } from "../../../application/tags/CreateTag";
import { TagDataModelBuilder } from "@/application/tags/TagDataModelMapper";
import { resolveTagRepository } from "@/interfaces/http/tags/repositoryProvider";
import { AppError } from "@/lib/errors/AppError";
import { normalizeTagName } from "./normalizers";

export async function GET(_req: Request) {
  const session = await getServerSession(authOptions);
  const sessionUserId = await getUserID(session);
  if (!sessionUserId) {
    return Response.json(
      { error: { code: "Unauthorized", message: "session user does not have a valid id" } },
      { status: 401 },
    );
  }

  try {
    const tagRepository = resolveTagRepository();
    const getTagUsecase = new GetTagsUseCase(tagRepository);
    const tags = await getTagUsecase.execute();
    const plainTags = tags.map((tag) => {
      const tagBuilder = new TagDataModelBuilder();
      tag.notify(tagBuilder);
      return tagBuilder.build();
    });
    return Response.json(plainTags, { status: 200 });
  } catch (error) {
    if (error instanceof AppError && error.code === "BadRequest") {
      return Response.json({ error: { code: error.code, message: error.message } }, { status: 400 });
    }
    console.error("Failed to fetch tags:", error);
    return Response.json({ error: { code: "InternalError", message: "Failed to fetch tags" } }, { status: 500 });
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
  const { tag_name } = body ?? {};

  try {
    const tagName = normalizeTagName("tag_name", tag_name);

    const tagRepository = resolveTagRepository();
    const createTagUsecase = new CreateTagUseCase(tagRepository);
    const created = await createTagUsecase.execute({ name: tagName });
    const tagBuilder = new TagDataModelBuilder();
    created.notify(tagBuilder);
    return Response.json(tagBuilder.build(), { status: 201 });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.code === "BadRequest") {
        return Response.json({ error: { code: error.code, message: error.message } }, { status: 400 });
      }
    }
    console.error("Failed to add tag:", error);
    return Response.json({ error: { code: "InternalError", message: "Failed to add tag" } }, { status: 500 });
  }
}
