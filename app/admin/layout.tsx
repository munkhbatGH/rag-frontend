export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col  justify-center gap-4">
      <div className="w-full text-center justify-center">
        {children}
      </div>
    </section>
  );
}
