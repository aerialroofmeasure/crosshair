"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function SignOutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();

  async function signOut() {
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch {
      // ignore — fall through to navigate
    }
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={signOut}
      className={
        compact
          ? "p-2 rounded-lg text-white/75 hover:text-white hover:bg-white/5 transition"
          : "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/75 hover:bg-white/5 hover:text-white transition"
      }
      aria-label="Sign out"
    >
      <LogOut className="h-4 w-4" />
      {!compact && <span>Sign out</span>}
    </button>
  );
}
