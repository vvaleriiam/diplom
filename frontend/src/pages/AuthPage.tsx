import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi } from "../api/playd";
import { useAuthStore } from "../store/auth";

export function AuthPage({ mode }: { mode: "login" | "register" }) {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = mode === "register" ? await authApi.register(form) : await authApi.login(form);
      setSession(response.token, response.user);
      toast.success(mode === "register" ? "Account created" : "Welcome back");
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  async function continueAsGuest() {
    setLoading(true);

    try {
      console.log("[Playd auth] guest login started", {
        apiUrl: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
        origin: window.location.origin,
      });
      const response = await authApi.guest();
      console.log("[Playd auth] guest login success", response.user);
      setSession(response.token, response.user);
      toast.success("Guest mode enabled");
      navigate("/");
    } catch (error: any) {
      console.error("[Playd auth] guest login failed", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      toast.error(error.response?.data?.message || "Guest login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 text-white">
      <form onSubmit={submit} className="w-full max-w-md rounded-lg border border-white/10 bg-panel p-8 shadow-glow">
        <h1 className="text-3xl font-black text-violet-200">Playd</h1>
        <p className="mt-2 text-sm text-white/55">
          {mode === "register" ? "Create your tracking profile." : "Sign in to your game library."}
        </p>
        <div className="mt-8 space-y-4">
          {mode === "register" ? (
            <input
              required
              placeholder="Name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="w-full rounded-lg border border-white/10 bg-panel2 px-4 py-3"
            />
          ) : null}
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className="w-full rounded-lg border border-white/10 bg-panel2 px-4 py-3"
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            className="w-full rounded-lg border border-white/10 bg-panel2 px-4 py-3"
          />
        </div>
        <button disabled={loading} className="mt-6 w-full rounded-lg bg-violet px-4 py-3 font-bold disabled:opacity-60">
          {loading ? "Please wait..." : mode === "register" ? "Create account" : "Sign in"}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={continueAsGuest}
          className="mt-3 w-full rounded-lg border border-white/10 px-4 py-3 font-semibold text-white/70 disabled:opacity-60"
        >
          Continue as guest
        </button>
        <p className="mt-5 text-center text-sm text-white/55">
          {mode === "register" ? "Already have an account?" : "No account yet?"}{" "}
          <Link className="text-violet-300" to={mode === "register" ? "/login" : "/register"}>
            {mode === "register" ? "Sign in" : "Register"}
          </Link>
        </p>
      </form>
    </div>
  );
}
