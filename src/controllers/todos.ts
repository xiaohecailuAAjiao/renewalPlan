import type { Request, Response } from "express";
import * as todoService from "../services/todos.js";

// 服务层全部是异步的：handler 必须 async + await，否则返回的是未决议的 Promise
export async function list(req: Request, res: Response) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 20));

  const result = await todoService.listTodos({ page, pageSize });
  res.json(result);
}

export async function getById(req: Request, res: Response) {
  const raw = req.params.id;
  const id = Number(raw);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: { message: "id must be a positive integer" } });
    return;
  }

  const todo = await todoService.getTodo(id);
  if (!todo) {
    res.status(404).json({ error: { code: "TODO_NOT_FOUND", message: "Todo not found" } });
    return;
  }

  res.json({ data: todo });
}

export async function create(req: Request, res: Response) {
  const title = req.body?.title;
  const userId = req.body?.userId;

  if (typeof title !== "string" || title.trim() === "") {
    res.status(400).json({ error: { message: "title is required and must be a non-empty string" } });
    return;
  }

  if (title.trim().length > 100) {
    res.status(400).json({ error: { message: "title must be at most 100 characters" } });
    return;
  }

  // Todo.userId 是必填外键，缺少时数据库会直接报错，这里先做入参校验
  if (typeof userId !== "number" || !Number.isInteger(userId) || userId <= 0) {
    res.status(400).json({ error: { message: "userId is required and must be a positive integer" } });
    return;
  }

  const todo = await todoService.createTodo(title.trim(), userId);
  res.status(201).json({ data: todo });
}

export async function update(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: { message: "id must be a positive integer" } });
    return;
  }

  const body = req.body;
  if (body === undefined || typeof body !== "object" || body === null) {
    res.status(400).json({ error: { message: "request body must be a JSON object" } });
    return;
  }

  const patch: { title?: string; done?: boolean } = {};

  if ("title" in body) {
    if (typeof body.title !== "string" || body.title.trim() === "") {
      res.status(400).json({ error: { message: "title must be a non-empty string" } });
      return;
    }
    if (body.title.trim().length > 100) {
      res.status(400).json({ error: { message: "title must be at most 100 characters" } });
      return;
    }
    patch.title = body.title.trim();
  }

  if ("done" in body) {
    if (typeof body.done !== "boolean") {
      res.status(400).json({ error: { message: "done must be a boolean" } });
      return;
    }
    patch.done = body.done;
  }

  if (Object.keys(patch).length === 0) {
    res.status(400).json({ error: { message: "at least one of title or done is required" } });
    return;
  }

  // prisma.update 在记录不存在时会抛 P2025，先查一次以保留原来的 404 语义
  const existing = await todoService.getTodo(id);
  if (!existing) {
    res.status(404).json({ error: { message: "Todo not found" } });
    return;
  }

  const updated = await todoService.updateTodo(id, patch);
  res.json({ data: updated });
}

export async function remove(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: { message: "id must be a positive integer" } });
    return;
  }

  // deleteTodo 返回 Promise<void>，无法用返回值判断是否存在，同样先查一次
  const existing = await todoService.getTodo(id);
  if (!existing) {
    res.status(404).json({ error: { message: "Todo not found" } });
    return;
  }

  await todoService.deleteTodo(id);
  res.status(204).end();
}