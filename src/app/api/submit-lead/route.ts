import { NextRequest, NextResponse } from "next/server";
import { formatLeadTelegramMessage } from "@/lib/lead-message";
import { parseLeadForm, type LeadFormData } from "@/lib/forms/schema";
import { sendTelegramMessage } from "@/lib/telegram";
import { isRole } from "@/types/role";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const role =
    typeof body === "object" && body !== null && "role" in body
      ? (body as { role: string }).role
      : null;

  if (!isRole(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const parsed = parseLeadForm(role, body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const data: LeadFormData = parsed.data;

  if (data.company) {
    return NextResponse.json({ ok: true });
  }

  const locale =
    typeof body === "object" && body !== null && "locale" in body
      ? String((body as { locale: string }).locale)
      : undefined;

  try {
    await sendTelegramMessage(formatLeadTelegramMessage(data, locale));
  } catch (error) {
    console.error("[submit-lead] Telegram delivery failed:", error);
    return NextResponse.json({ error: "Delivery failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
