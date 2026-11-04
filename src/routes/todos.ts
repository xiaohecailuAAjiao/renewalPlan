import { Router } from "express";
import * as todoController from "../controllers/todos.js";

export const todosRouter = Router();

todosRouter.get("/", todoController.list);
todosRouter.get("/:id", todoController.getById);
todosRouter.post("/", todoController.create);
todosRouter.patch("/:id", todoController.update);
todosRouter.delete("/:id", todoController.remove);