function TableSkeleton({ columns = 4, rows = 5 }) {
  return (
    <div className="animate-pulse space-y-3 rounded-xl border border-white/10 bg-slate-900/50 p-4">
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="grid grid-cols-5 gap-4">
          {Array.from({ length: columns }).map((__, col) => (
            <div
              key={`${row}-${col}`}
              className="h-6 rounded bg-white/5"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default TableSkeleton;
