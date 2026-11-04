export interface Todo {
  id: number;
  title: string;
  done: boolean;
  createdAt: string;
}

let nextId = 1;
const todos: Todo[] = [];

export function listTodos(): Todo[] {
  return [...todos];
}

export function getTodo(id: number): Todo | undefined {
  return todos.find((t) => t.id === id);
}

export function createTodo(title: string): Todo {
  const todo: Todo = {
    id: nextId++,
    title,
    done: false,
    createdAt: new Date().toISOString(),
  };
  todos.push(todo);
  return todo;
}

export function updateTodo(
  id: number,
  patch: { title?: string; done?: boolean },
): Todo | undefined {
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return undefined;

  const current = todos[index];
  if (!current) return undefined; 

  // 只更新 patch 里显式存在的字段
  const updated: Todo = {
    ...current,
    title: patch.title ?? current.title,
    done: patch.done ?? current.done,
  };

  todos[index] = updated;
  return updated;
}

export function deleteTodo(id:number):boolean{
  const index = todos.findIndex((t)=> t.id === id)
  if(index> -1){
    todos.splice(index,1)
    return true
  }
  return false
}


