import { Gamepad2, LogOut, Search, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/auth";

export function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");

  const isOnCatalog = location.pathname === "/";

  useEffect(() => {
    if (!isOnCatalog) return;
    const timer = window.setTimeout(() => {
      if (searchInput.trim()) {
        setSearchParams({ q: searchInput.trim() }, { replace: true });
      } else {
        setSearchParams({}, { replace: true });
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchInput, isOnCatalog]);

  useEffect(() => {
    if (!isOnCatalog) setSearchInput("");
  }, [isOnCatalog]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${isActive ? "bg-violet text-white" : "text-white/65 hover:text-white"}`;

  return (
    <div className="min-h-screen text-violet-50">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-panel/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <NavLink to="/" className="flex flex-shrink-0 items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet">
              <Gamepad2 size={20} />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-black leading-tight">Playd</div>
              <div className="text-[10px] leading-tight text-white/45">Personal game tracker</div>
            </div>
          </NavLink>

          <nav className="flex flex-1 items-center justify-center gap-1">
            <NavLink to="/" end className={linkClass}>Games</NavLink>
            <NavLink to="/library" className={linkClass}>My library</NavLink>
            <NavLink to="/wishlist" className={linkClass}>Wishlist</NavLink>
            <NavLink to="/stats" className={linkClass}>Statistics</NavLink>
            {user?.role === "admin" && (
              <NavLink to="/admin" className={linkClass}>
                <Shield size={14} className="mr-1 inline" />
                Admin
              </NavLink>
            )}
          </nav>

          <div className="flex flex-shrink-0 items-center gap-2">
            <div className={`relative hidden sm:block transition-opacity duration-150 ${isOnCatalog ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for game"
                className="w-44 rounded-lg border border-white/10 bg-panel2 py-2 pl-3 pr-8 text-sm placeholder:text-white/35 focus:border-violet/50 focus:outline-none lg:w-52"
              />
              <Search size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/35" />
            </div>
            <NavLink
              to="/profile"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/65 hover:text-white"
            >
              <User size={17} />
              <span className="hidden sm:block">Profile</span>
            </NavLink>
            <button
              onClick={() => { logout(); navigate("/login"); }}
              className="rounded-lg p-2 text-white/65 hover:text-white"
              title="Sign out"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
