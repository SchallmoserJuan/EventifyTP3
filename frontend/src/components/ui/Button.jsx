import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 text-white shadow-[0_10px_30px_rgba(30,64,175,0.35)] hover:brightness-110",
  outline:
    "border border-white/20 text-white hover:border-white/60 hover:bg-white/10",
  ghost: "text-slate-200 hover:bg-white/5",
  destructive:
    "bg-gradient-to-r from-rose-500 to-orange-500 text-white hover:brightness-110",
};

function Button({
  className,
  variant = "primary",
  disabled,
  type = "button",
  ...props
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition",
        variants[variant],
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      disabled={disabled}
      type={type}
      {...props}
    />
  );
}

export default Button;
