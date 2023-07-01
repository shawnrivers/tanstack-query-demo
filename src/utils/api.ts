import {
  GetTodoListResponse,
  PostTodoResponse,
} from '@/pages/api/todo/index.page';
import { GetTodoResponse, PutTodoResponse } from '@/pages/api/todo/[id].page';
import axios from 'axios';

type Options = {
  shouldFail: boolean;
};

export const api = {
  fetchTodoList: async () => {
    const { data } = await axios.get<GetTodoListResponse>('/api/todo');
    return data.data;
  },
  fetchTodo: async (id: number) => {
    const { data } = await axios.get<GetTodoResponse>(`/api/todo/${id}`);
    return data.data;
  },
  createTodo: async (title: string, options?: Options) => {
    const { data } = await axios.post<PostTodoResponse>('/api/todo', {
      title,
      options: {
        should_fail: options?.shouldFail,
      },
    });
    return data.data;
  },
  updateTodo: async (
    params: {
      id: number;
      complete?: boolean;
      title?: string;
      description?: string;
    },
    options?: Options,
  ) => {
    const { id, ...body } = params;
    const { data } = await axios.patch<PutTodoResponse>(`/api/todo/${id}`, {
      ...body,
      options: {
        should_fail: options?.shouldFail,
      },
    });
    return data.data;
  },
  deleteTodo: async (id: number, options?: Options) => {
    await axios.delete(`/api/todo/${id}`, {
      data: {
        options: {
          should_fail: options?.shouldFail,
        },
      },
    });
  },
};
