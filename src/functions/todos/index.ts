import { AuthOnly } from "@/lib/auth/middleware/auth-guard";
import { db } from "@/lib/db";
import { todo } from "@/lib/db/schema";
import { todoSchema } from "@/lib/db/zod-schemas";
import { uuid } from "@/lib/utils";
import { createServerFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { desc, eq } from "drizzle-orm";
import z from "zod";

export const getTodos = createServerFn({ method: "GET" })
  .middleware([AuthOnly])
  .handler(async ({ context }) => {
    // await new Promise((promise) => setTimeout(promise, 2000));
    try {
      const todos = await db
        .select()
        .from(todo)
        .where((todo) => eq(todo.userId, context.session.user.id))
        .orderBy(desc(todo.createdAt));
      setResponseStatus(200);
      return { success: true, data: todos };
    } catch (e) {
      console.error(e);
      return { success: false, message: "Failed to fetch Todos" };
    }
  });

export const updateTodo = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string(), completed: z.boolean() }))
  .middleware([AuthOnly])
  .handler(async ({ data, context }) => {
    const { id, completed } = data;
    const userId = context.session.user.id;

    try {
      const existingTodo = await db.query.todo.findFirst({
        where: (todo) => eq(todo.id, id),
      });

      if (!existingTodo) {
        setResponseStatus(404);
        return {
          success: false,
          message: "Todo not found",
        };
      }

      if (existingTodo.userId !== userId) {
        setResponseStatus(403);
        return {
          success: false,
          message: "You are not authorized to update this todo",
        };
      }

      await db.update(todo).set({ completed }).where(eq(todo.id, id));

      setResponseStatus(200);
      return {
        success: true,
        message: "Todo updated successfully",
      };
    } catch (error) {
      console.error("Failed to update todo:", error);
      setResponseStatus(500);
      return {
        success: false,
        message: "Internal server error while updating todo",
      };
    }
  });

export const createTodo = createServerFn({ method: "POST" })
  .middleware([AuthOnly])
  .validator(todoSchema)
  .handler(async ({ data, context }) => {
    try {
      await db.insert(todo).values({
        id: uuid(),
        userId: context.session.user.id,
        title: data.title,
        date: data.date,
      });
      setResponseStatus(201);
      return { success: true, message: "Todo created successfully!" };
    } catch (e) {
      console.error(e);
      return { success: false, message: "Failed to Create Todo" };
    }
  });

export const deleteTodo = createServerFn({ method: "POST" })
  .middleware([AuthOnly])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data: { id }, context }) => {
    try {
      const getTodo = await db.query.todo.findFirst({
        where: (todo) => eq(todo.id, id),
      });

      if (!getTodo) {
        setResponseStatus(404);
        return { success: false, message: "Todo to delete Not Found" };
      }

      if (getTodo.userId !== context.session.user.id) {
        setResponseStatus(403);
        return { success: false, message: "Forbidden" };
      }

      await db.delete(todo).where(eq(todo.id, id));
      setResponseStatus(200);
      return { success: true, message: "Todo deleted successfully" };
    } catch (e) {
      console.error(e);
      return { success: false, message: "Failed to delete Todo" };
    }
  });
