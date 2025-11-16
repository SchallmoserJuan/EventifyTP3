import { cn } from "@/lib/utils";

export function Table({ className, children, ...props }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-900/30">
      <table className={cn("w-full text-left text-sm", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children }) {
  return (
    <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-400">
      {children}
    </thead>
  );
}

export function TableHeaderRow({ children }) {
  return <tr>{children}</tr>;
}

export function Th({ className, ...props }) {
  return (
    <th className={cn("px-4 py-3 font-medium", className)} {...props} />
  );
}

export function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

export function Td({ className, ...props }) {
  return (
    <td className={cn("px-4 py-3 text-slate-200", className)} {...props} />
  );
}
