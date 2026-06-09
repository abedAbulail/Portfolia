export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen max-w-none px-6">
      <div className="mx-auto max-w-[1400px]">{children}</div>
    </div>
  );
}
