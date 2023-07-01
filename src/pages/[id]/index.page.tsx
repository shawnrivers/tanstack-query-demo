import { Loader } from '@/components/Loader';
import { Button } from '@/components/Button';
import { api } from '@/utils/api';
import { Todo } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const TodoDetails: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ id }) => {
  const { push } = useRouter();

  const [title, setTitle] = useState('');
  const [complete, setComplete] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['todos', id],
    queryFn: () => api.fetchTodo(id),
  });

  const { mutate, isLoading: isMutating } = useMutation({
    mutationFn: (params: { id: number; title: string; complete: boolean }) =>
      api.updateTodo(params),
    onMutate: async ({ id, title, complete }) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      // Optimistically update the TODO list data
      queryClient.setQueryData<Todo[]>(['todos'], oldTodos =>
        oldTodos?.map(todo =>
          todo.id === id ? { ...todo, title, complete } : todo,
        ),
      );
    },
    onSuccess: () => {
      toast.success('Success!');
      // Refetch the TODO data
      // (including queries that are not rendered currently)
      queryClient.refetchQueries({ queryKey: ['todos'] });
      push('/');
    },
    onError: () => {
      toast.error('Failed!');
    },
  });

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setComplete(data.complete);
    }
  }, [data]);

  return (
    <main className="p-8">
      <div className="mb-4">
        <Link href="/" aria-label="Back" className="inline-block">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </Link>
      </div>
      <h1 className="mb-4 text-4xl font-bold">Edit TODO</h1>
      {!isLoading ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            mutate({ id, title, complete });
          }}
          className="min-w-[16rem] rounded-lg bg-gray-100 p-4"
        >
          <div className="mt-4 flex flex-col items-start gap-4">
            <label className="block space-y-2">
              <div className="text-lg font-bold">Title</div>
              <input
                className="inline-block rounded-lg border border-gray-300 p-2"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="text-lg font-bold">Complete</span>
              <div className="relative flex">
                <input
                  className={clsx(
                    'h-6 w-6 cursor-pointer appearance-none rounded-full border-[1.5px] border-gray-400',
                    complete && 'bg-gray-400',
                  )}
                  type="checkbox"
                  checked={complete}
                  onChange={e => setComplete(e.target.checked)}
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    stroke="currentColor"
                    className={clsx(
                      'h-4 w-4',
                      complete ? 'text-white/100' : 'text-white/0',
                    )}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
              </div>
            </label>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <Button disabled={title === ''} isLoading={isMutating}>
              SAVE
            </Button>
          </div>
        </form>
      ) : (
        <Loader className="h-6 w-6 text-gray-700" />
      )}
    </main>
  );
};

export default TodoDetails;

export const getServerSideProps = (async ({ params }) => {
  if (params == undefined || typeof params.id != 'string') {
    return {
      props: {
        id: 0,
      },
    };
  }

  return { props: { id: parseInt(params.id, 10) } };
}) satisfies GetServerSideProps;
