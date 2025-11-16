import { cn } from "@/lib/utils";

const variants = {
  default: "bg-white/10 text-white",
  success: "bg-emerald-500/20 text-emerald-300",
  warning: "bg-amber-500/20 text-amber-300",
  danger: "bg-rose-500/20 text-rose-200",
};

function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export default Badge;
