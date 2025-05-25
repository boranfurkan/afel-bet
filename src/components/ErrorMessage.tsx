interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-white bg-red-500/20 border border-red-500 rounded-lg p-4">
        {message}
      </div>
    </div>
  );
}
