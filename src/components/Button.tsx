import { Loader } from '@/components/Loader';
import clsx from 'clsx';

type ButtonProps = {
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

export const Button: React.FC<ButtonProps> = ({
  disabled = false,
  isLoading = false,
  className,
  children,
  onClick,
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={clsx(
        'inline-flex items-center gap-2 rounded-lg border bg-gray-700 px-4 py-2 text-gray-100 disabled:cursor-not-allowed disabled:bg-gray-400',
        className,
      )}
      onClick={onClick}
    >
      <span className="font-bold">{children}</span>
      {isLoading && <Loader className="h-6 w-6 text-gray-500" />}
    </button>
  );
};
