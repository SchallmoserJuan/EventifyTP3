function BackgroundBeams() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-70"
    >
      <div className="absolute -top-1/2 left-1/2 h-[120vh] w-[120vw] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-700/40 via-cyan-500/30 to-emerald-400/25 blur-3xl" />
      <div className="absolute top-1/3 -left-32 h-96 w-96 animate-pulse rounded-full bg-purple-600/25 blur-[160px]" />
      <div className="absolute bottom-10 right-0 h-80 w-80 animate-pulse rounded-full bg-cyan-500/30 blur-[120px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.25),transparent_55%)]" />
    </div>
  );
}

export default BackgroundBeams;
