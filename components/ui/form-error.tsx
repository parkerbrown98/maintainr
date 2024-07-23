export function FormError({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-destructive/10 text-destructive text-sm font-medium p-2 rounded-md">
      {children}
    </div>
  );
}
