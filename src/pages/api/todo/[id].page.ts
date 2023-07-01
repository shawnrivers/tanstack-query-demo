import { prismaClient } from '@/api/prismaClient';
import { wait } from '@/utils/wait';
import { Todo } from '@prisma/client';
import { NextApiHandler } from 'next';
import { z } from 'zod';

type Error = {
  error: string;
};

export type GetTodoResponse = {
  data: Todo;
};

export type PutTodoResponse = {
  data: Todo;
};

type DeleteTodoResponse = {
  message: 'Todo deleted';
};

const handler: NextApiHandler<
  GetTodoResponse | PutTodoResponse | DeleteTodoResponse | Error
> = async (req, res) => {
  await wait();

  if (req.body.options?.should_fail) {
    return res.status(500).json({ error: 'Internal server error' });
  }

  if (req.method === 'GET') {
    try {
      const id = await z.coerce.number().parseAsync(req.query.id);

      try {
        const todo = await prismaClient.todo.findUnique({
          where: { id },
        });
        if (todo == null) {
          return res.status(404).json({
            error: 'Not Found',
          });
        }
        return res.status(200).json({ data: todo });
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

  if (req.method === 'PATCH') {
    try {
      const id = await z.coerce.number().parseAsync(req.query.id);
      const body = await z
        .object({
          title: z.string().optional(),
          complete: z.boolean().optional(),
        })
        .optional()
        .parseAsync(req.body);
      try {
        const updatedTodo = await prismaClient.todo.update({
          where: { id },
          data: {
            title: body?.title,
            complete: body?.complete,
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

  if (req.method === 'DELETE') {
    try {
      const id = await z.coerce.number().parseAsync(req.query.id);
      try {
        await prismaClient.todo.delete({
          where: { id },
        });
        return res.status(200).json({ message: 'Todo deleted' });
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
