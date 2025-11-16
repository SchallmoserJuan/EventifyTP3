import { cn } from "@/lib/utils";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "glass card-hover relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur",
        "before:pointer-events-none before:absolute before:inset-px before:-z-10 before:rounded-[18px] before:bg-gradient-to-r before:from-white/5 before:to-white/0",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={cn("mb-4 flex items-center justify-between", className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn("text-lg font-semibold", className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn("space-y-4", className)} {...props} />;
}
