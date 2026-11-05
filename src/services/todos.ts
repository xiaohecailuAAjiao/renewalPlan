import { prisma } from "../db.js";
import type { Todo } from "../generated/prisma/client.js";

export async function listTodos(options?: { page?: number; pageSize?: number }) {
  const page = options?.page ?? 1;
  const pageSize = options?.pageSize ?? 20;

  const [todos, total] = await Promise.all([
    prisma.todo.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.todo.count(),
  ]);

  return { data: todos, meta: { page, pageSize, total } };
}


export async function getTodo(id: number): Promise<Todo | null> {
  return prisma.todo.findUnique({ where: { id } });
}

export async function createTodo(title: string, userId: number): Promise<Todo> {
  return prisma.todo.create({ data: { title, userId } });
}

export async function updateTodo(id: number, patch: { title?: string; done?: boolean }): Promise<Todo> {
  return prisma.todo.update({ where: { id }, data: patch });
}

export async function deleteTodo(id: number): Promise<void> {
  await prisma.todo.delete({ where: { id } });
}