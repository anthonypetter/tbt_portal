type Props = {
  className: string;
  children: React.ReactNode;
};

export function Badge({ className, children }: Props) {
  return (
    <span
      className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}
