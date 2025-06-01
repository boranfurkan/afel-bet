interface SpinnerProps {
  className?: string;
}

export const Spinner = ({ className }: SpinnerProps) => (
  <div
    className={`w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin ${
      className || ""
    }`}
  />
);
