import { useState, useEffect, useMemo } from "react";
import { RouterProvider } from "react-router";
import { Session } from "@supabase/supabase-js";
import { createRouter } from "./routes";
import { CharacterProvider } from "./contexts/CharacterContext";
import { UserProvider } from "./contexts/UserContext";
import supabase from "../supabaseClient";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isLoggedIn = !!session;

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const router = useMemo(
    () => createRouter(isLoggedIn, () => {}, handleLogout),
    [isLoggedIn]
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-50 animate-pulse"></div>
            <div className="relative w-16 h-16 border-4 border-cyan-400/50 border-t-cyan-400 rounded-full animate-spin"></div>
          </div>
          <p className="text-cyan-400 text-sm tracking-widest uppercase animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <CharacterProvider>
      <UserProvider session={session}>
        <RouterProvider router={router} />
      </UserProvider>
    </CharacterProvider>
  );
}