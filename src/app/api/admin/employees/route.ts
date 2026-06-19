import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { assertAdmin } from "@/lib/profile";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/admin/employees — create a new employee account.
 * Body: { email, full_name, password }
 * Creates the auth user (email pre-confirmed) and ensures a profile row
 * with role=employee.
 */
export async function POST(req: Request) {
  const guard = await assertAdmin();
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status });

  let body: { email?: string; full_name?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const fullName = (body.full_name ?? "").trim();
  const password = body.password ?? "";

  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: "Temporary password must be 8+ characters." }, { status: 400 });

  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, role: "employee" },
    });
    if (error) {
      const msg = /already|registered|exists/i.test(error.message)
        ? "An account with that email already exists."
        : error.message;
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const userId = data.user?.id;
    if (userId) {
      // Ensure the profile reflects the employee role (covers a missing trigger).
      await admin
        .from("profiles")
        .upsert(
          { id: userId, email, full_name: fullName, role: "employee", is_active: true },
          { onConflict: "id" }
        );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/employees POST] failed", e);
    return NextResponse.json({ error: "Couldn't create the employee." }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/employees — manage an existing employee.
 * Body: { id, action: 'enable' | 'disable' | 'reset_password' | 'rename', password?, full_name? }
 */
export async function PATCH(req: Request) {
  const guard = await assertAdmin();
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status });

  let body: { id?: string; action?: string; password?: string; full_name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.id || !body.action) return NextResponse.json({ error: "id and action required" }, { status: 400 });

  const admin = createSupabaseAdminClient();

  try {
    switch (body.action) {
      case "enable":
      case "disable": {
        const isActive = body.action === "enable";
        const { error } = await admin.from("profiles").update({ is_active: isActive }).eq("id", body.id);
        if (error) throw error;
        // Also (un)ban at the auth layer so a disabled employee can't sign in.
        await admin.auth.admin.updateUserById(body.id, {
          ban_duration: isActive ? "none" : "876000h", // ~100 years
        });
        return NextResponse.json({ ok: true });
      }
      case "reset_password": {
        if (!body.password || body.password.length < 8) {
          return NextResponse.json({ error: "Password must be 8+ characters." }, { status: 400 });
        }
        const { error } = await admin.auth.admin.updateUserById(body.id, { password: body.password });
        if (error) throw error;
        return NextResponse.json({ ok: true });
      }
      case "rename": {
        const fullName = (body.full_name ?? "").trim();
        const { error } = await admin.from("profiles").update({ full_name: fullName }).eq("id", body.id);
        if (error) throw error;
        await admin.auth.admin.updateUserById(body.id, { user_metadata: { full_name: fullName, role: "employee" } });
        return NextResponse.json({ ok: true });
      }
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (e) {
    console.error("[admin/employees PATCH] failed", e);
    return NextResponse.json({ error: "Couldn't update the employee." }, { status: 500 });
  }
}
