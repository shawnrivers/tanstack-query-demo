import { AddTodoForm } from '@/components/AddTodoForm';
import { Loader } from '@/components/Loader';
import { TodoItem } from '@/components/TodoItem';
import { api } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';
import { NextPage } from 'next';

const Home: NextPage = () => {
  const { data, status } = useQuery({
    queryKey: ['todos'],
    queryFn: () => api.fetchTodoList(),
  });

  return (
    <div>
      <h1 className="text-4xl font-bold">TODO with Tanstack Query</h1>
      <AddTodoForm />
      <section className="mt-4">
        <h2 className="text-2xl font-bold">List</h2>
        <div className="mt-2">
          {status === 'loading' && <Loader className="h-6 w-6 text-gray-700" />}
          {status === 'success' &&
            (data.length > 0 ? (
              <ul className="flex flex-col items-start gap-1">
                {data.map(todo => (
                  <li key={todo.id}>
                    <TodoItem
                      id={todo.id}
                      title={todo.title}
                      complete={todo.complete}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p>No TODO</p>
            ))}
          {status === 'error' && (
            <p className="text-red-500">Something went wrong!</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
