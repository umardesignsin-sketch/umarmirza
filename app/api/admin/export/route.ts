import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { exportWaitlistUsers } from "@/lib/admin-data";
import { waitlistToCsv } from "@/lib/csv";

export async function GET(request: Request) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const sourceParam = searchParams.get("source") ?? "all";
  const source =
    sourceParam === "creator" || sourceParam === "waitlist" ? sourceParam : "all";

  try {
    const rows = await exportWaitlistUsers(auth.db, source);
    const csv = waitlistToCsv(rows);
    const stamp = new Date().toISOString().slice(0, 10);
    const filename =
      source === "creator"
        ? `fnj-creators-${stamp}.csv`
        : source === "waitlist"
          ? `fnj-waitlist-${stamp}.csv`
          : `fnj-waitlist-all-${stamp}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("csv export failed", error);
    return NextResponse.json(
      { error: "Could not export CSV." },
      { status: 500 },
    );
  }
}
