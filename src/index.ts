import express from "express";
import { logger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/error-handler.js";
import { todosRouter } from "./routes/todos.js"

const app = express();
const port = 3000;

// 顺序很重要：日志最先，body 解析其次，路由之后是错误中间件
app.use(logger);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express 5 + TS" });
});

app.use("/todos", todosRouter);

// 异步抛错（验证 Express 5 会自动转发）
app.get("/boom-async", async () => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  throw new Error("Async exploded");
});

// 兜底 404：Express 5 不要用裸 "*"
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: "ROUTE_NOT_FOUND",
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    },
  });
});

// 错误中间件必须放在所有路由之后
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

