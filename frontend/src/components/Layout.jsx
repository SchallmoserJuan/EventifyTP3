import Header from "./Header.jsx";
import BackgroundBeams from "./BackgroundBeams.jsx";

function Layout({ children }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <BackgroundBeams />
      <Header />
      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 py-10 md:px-8 lg:px-0">
        {children}
      </main>
    </div>
  );
}

export default Layout;
