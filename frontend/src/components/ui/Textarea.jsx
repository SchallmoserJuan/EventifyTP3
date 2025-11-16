import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const Textarea = forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white placeholder:text-slate-500",
      "focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50",
      className
    )}
    {...props}
  />
));

Textarea.displayName = "Textarea";

export default Textarea;
