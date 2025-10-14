export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[1200px] mx-auto min-h-screen flex flex-col border-l border-r">
      {children}
    </div>
  );
}
