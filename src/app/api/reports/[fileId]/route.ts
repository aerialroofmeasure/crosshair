import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getProfile, isStaffRole } from "@/lib/profile";

const BUCKET = "reports";

/**
 * GET /api/reports/[fileId] — authorize, then redirect to a short-lived
 * signed download URL. Customers may download files for their own orders;
 * staff (employees/admins) may download any.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ fileId: string }> }) {
  const { fileId } = await params;

  const profile = await getProfile();
  if (!profile) return NextResponse.json({ error: "Sign in to download." }, { status: 401 });

  try {
    const admin = createSupabaseAdminClient();

    const { data: file, error } = await admin
      .from("order_files")
      .select("id, order_id, storage_path, file_name")
      .eq("id", fileId)
      .maybeSingle();
    if (error) throw error;
    if (!file) return NextResponse.json({ error: "File not found." }, { status: 404 });

    // Authorize: staff can read any; customers only their own order's files.
    if (!isStaffRole(profile.role)) {
      const { data: order } = await admin
        .from("orders")
        .select("user_id")
        .eq("id", file.order_id)
        .maybeSingle();
      if (!order || order.user_id !== profile.id) {
        return NextResponse.json({ error: "Not allowed." }, { status: 403 });
      }
    }

    const { data: signed, error: signErr } = await admin.storage
      .from(BUCKET)
      .createSignedUrl(file.storage_path, 60, { download: file.file_name });
    if (signErr || !signed) throw signErr ?? new Error("No signed URL");

    return NextResponse.redirect(signed.signedUrl);
  } catch (e) {
    console.error("[reports/download] failed", e);
    return NextResponse.json({ error: "Couldn't generate the download." }, { status: 500 });
  }
}
