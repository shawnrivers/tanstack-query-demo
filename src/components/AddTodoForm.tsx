import { Button } from '@/components/Button';
import { api } from '@/utils/api';
import { Todo } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export const AddTodoForm: React.FC = () => {
  const [title, setTitle] = useState('');

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: (title: string) => api.createTodo(title, { shouldFail: false }),
    onSuccess: async addedTodo => {
      toast.success('Success!');
      setTitle('');
      // Update the TODO list data with the create TODO API response
      queryClient.setQueryData<Todo[]>(['todos'], oldTodos => [
        ...(oldTodos ?? []),
        addedTodo,
      ]);
      // Refetch the TODO data
      // (only queries that are rendered currently)
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError: () => {
      toast.error('Failed!');
    },
  });

  return (
    <form
      className="mt-4 flex items-center gap-2"
      onSubmit={async e => {
        e.preventDefault();
        mutate(title);
      }}
    >
      <input
        className="inline-block rounded-lg border border-gray-300 p-2"
        aria-label="Todo name"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <Button isLoading={isLoading}>ADD</Button>
    </form>
  );
};
