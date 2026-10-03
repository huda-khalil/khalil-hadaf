export default function ComingSoon({ title }: { title: string }) {
  return (
    <div>
      <div className="mb-10">
        <div className="text-xs uppercase tracking-[0.3em] text-brass mb-3">
          {title}
        </div>
        <h1 className="font-serif text-3xl font-light tracking-tight">
          Coming soon
        </h1>
      </div>
      <div className="border border-hairline rounded-sm p-8 text-sm text-muted">
        This section is under construction.
      </div>
    </div>
  );
}
