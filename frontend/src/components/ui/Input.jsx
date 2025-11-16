import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const Input = forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white placeholder:text-slate-500",
      "focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50",
      className
    )}
    {...props}
  />
));

Input.displayName = "Input";

export default Input;
