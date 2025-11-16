function Loader({ label = "Cargando" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-slate-900/50 px-6 py-12 text-sm text-slate-400">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-sky-400" />
      <span>{label}...</span>
    </div>
  );
}

export default Loader;
