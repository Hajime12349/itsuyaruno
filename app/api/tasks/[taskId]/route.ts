import { getServerSession } from 'next-auth';
import { authOptions, getUserID } from '@/lib/auth';
import { GetTaskByIdUseCase } from '@/application/tasks/GetTaskById';
import { UpdateTaskUseCase } from '@/application/tasks/UpdateTask';
import { DeleteTaskUseCase } from '@/application/tasks/DeleteTask';
import { toDTO } from '@/interfaces/http/tasks/mappers';
import { resolveTaskRepository } from '@/interfaces/http/tasks/repositoryProvider';

function parseTaskId(raw: string | string[] | undefined) {
  if (typeof raw !== 'string') {
    return null;
  }
  const taskId = Number(raw);
  if (!Number.isInteger(taskId) || taskId < 1) {
    return null;
  }
  return taskId;
}

function normalizeTaskPayload(body: any) {
  const { task_name, deadline, total_set, current_set, is_complete } = body ?? {};

  if (typeof task_name !== 'string' || task_name.trim().length === 0) {
    throw new Error('BadRequest: task_name');
  }
  if (typeof total_set !== 'number' || !Number.isInteger(total_set) || total_set < 1) {
    throw new Error('BadRequest: total_set');
  }
  if (typeof current_set !== 'number' || !Number.isInteger(current_set) || current_set < 0) {
    throw new Error('BadRequest: current_set');
  }
  if (typeof is_complete !== 'boolean') {
    throw new Error('BadRequest: is_complete');
  }

  let normalizedDeadline: string | undefined = undefined;
  if (typeof deadline === 'string') {
    const trimmed = deadline.trim();
    if (trimmed.length > 0) {
      normalizedDeadline = trimmed;
    }
  }

  return {
    name: task_name.trim(),
    deadline: normalizedDeadline,
    totalSet: total_set,
    currentSet: current_set,
    isComplete: is_complete,
  } as const;
}

async function requireUserId() {
  const session = await getServerSession(authOptions);
  const userId = await getUserID(session);
  if (!userId) {
    throw new Response(JSON.stringify({ error: 'Unauthorized: session user does not have a valid id' }), { status: 401 });
  }
  return userId;
}

export async function GET(request: Request, { params }: { params: { taskId: string } }) {
  const taskId = parseTaskId(params?.taskId);
  if (taskId === null) {
    return Response.json({ error: 'Bad Request: invalid task id' }, { status: 400 });
  }

  try {
    const userId = await requireUserId();
    const repo = resolveTaskRepository();
    const usecase = new GetTaskByIdUseCase(repo);
    const task = await usecase.execute({ id: taskId, userId });
    if (!task) {
      return Response.json({ error: 'Task not found' }, { status: 404 });
    }
    return Response.json(toDTO(task), { status: 200 });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error('Failed to get task:', error);
    return Response.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { taskId: string } }) {
  const taskId = parseTaskId(params?.taskId);
  if (taskId === null) {
    return Response.json({ error: 'Bad Request: invalid task id' }, { status: 400 });
  }

  let payload;
  try {
    const body = await request.json().catch(() => ({}));
    payload = normalizeTaskPayload(body);
  } catch (error) {
    const message = (error as Error)?.message ?? '';
    if (message.startsWith('BadRequest:')) {
      return Response.json({ error: message }, { status: 400 });
    }
    console.error('Failed to parse request body:', error);
    return Response.json({ error: 'Bad Request: invalid body' }, { status: 400 });
  }

  try {
    const userId = await requireUserId();
    const repo = resolveTaskRepository();
    const usecase = new UpdateTaskUseCase(repo);
    const updated = await usecase.execute({
      id: taskId,
      userId,
      name: payload.name,
      deadline: payload.deadline,
      totalSet: payload.totalSet,
      currentSet: payload.currentSet,
      isComplete: payload.isComplete,
    });
    return Response.json(toDTO(updated), { status: 200 });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    const message = (error as Error)?.message ?? '';
    if (message.startsWith('ValidationError:')) {
      return Response.json({ error: message }, { status: 400 });
    }
    if (message === 'TaskNotFound') {
      return Response.json({ error: 'Task not found' }, { status: 404 });
    }
    console.error('Failed to update task:', error);
    return Response.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { taskId: string } }) {
  const taskId = parseTaskId(params?.taskId);
  if (taskId === null) {
    return Response.json({ error: 'Bad Request: invalid task id' }, { status: 400 });
  }

  try {
    const userId = await requireUserId();
    const repo = resolveTaskRepository();
    const usecase = new DeleteTaskUseCase(repo);
    await usecase.execute({ id: taskId, userId });
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    const message = (error as Error)?.message ?? '';
    if (message === 'TaskNotFound') {
      return Response.json({ error: 'Task not found' }, { status: 404 });
    }
    console.error('Failed to delete task:', error);
    return Response.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
