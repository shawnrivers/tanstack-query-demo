import { prismaClient } from '@/api/prismaClient';
import { wait } from '@/utils/wait';
import { Todo } from '@prisma/client';
import type { NextApiHandler } from 'next';
import { z } from 'zod';

type Error = {
  error: string;
};

export type GetTodoListResponse = {
  data: Todo[];
};

export type PostTodoResponse = {
  data: Todo;
};

const handler: NextApiHandler<
  GetTodoListResponse | PostTodoResponse | Error
> = async (req, res) => {
  await wait();

  if (req.body.options?.should_fail) {
    return res.status(500).json({ error: 'Internal server error' });
  }

  if (req.method === 'GET') {
    const todoList = await prismaClient.todo.findMany();
    return res.status(200).json({ data: todoList });
  }

  if (req.method === 'POST') {
    try {
      const { title } = await z
        .object({
          title: z.string(),
        })
        .parseAsync(req.body);
      try {
        const newTodo = await prismaClient.todo.create({
          data: {
            title,
            complete: false,
          },
        });
        return res.status(200).json({ data: newTodo });
      } catch (e) {
        return res.status(500).json({
          error: 'Internal server error',
        });
      }
    } catch (e) {
      return res.status(400).json({
        error: 'Bad request',
      });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { id, title, complete } = await z
        .object({
          id: z.number(),
          title: z.string().optional(),
          complete: z.boolean().optional(),
        })
        .parseAsync(req.body);
      try {
        const updatedTodo = await prismaClient.todo.update({
          where: { id },
          data: {
            title,
            complete,
          },
        });
        return res.status(200).json({ data: updatedTodo });
      } catch (e) {
        return res.status(500).json({
          error: 'Internal server error',
        });
      }
    } catch (e) {
      return res.status(400).json({
        error: 'Bad request',
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

export default handler;
