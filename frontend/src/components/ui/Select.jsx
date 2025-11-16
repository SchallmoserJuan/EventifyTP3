import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

const Select = forwardRef(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={cn(
        "w-full appearance-none rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40",
        "pr-10",
        className
      )}
      {...props}
    >
      {children}
    </select>
    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
  </div>
));

Select.displayName = "Select";

export default Select;
