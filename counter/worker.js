/**
 * AI Token 羊毛日报 · 访问计数器
 * Cloudflare Worker + KV，提供 /hit（+1）与 /stats（只读）
 * 部署说明见 COUNTER.md
 */
const ALLOWED = [
  "https://token.879879.xyz",
  "https://token.weidongpei.workers.dev",
  "https://dizzy-roadrunner-d4ecxir07e8ea5d-1251001596.tcloudbaseapp.com",
];

function corsHeaders(request) {
  const origin = request.headers.get("Origin") || "";
  const allow = ALLOWED.includes(origin) ? origin : ALLOWED[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  };
}

function beijingDay() {
  return new Date(Date.now() + 8 * 3600 * 1000).toISOString().slice(0, 10);
}

async function readStats(env) {
  const day = beijingDay();
  const [total, today] = await Promise.all([
    env.COUNTER.get("total"),
    env.COUNTER.get("day:" + day),
  ]);
  return { today: Number(today || 0), total: Number(total || 0), day };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const headers = corsHeaders(request);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    if (request.method === "POST" && url.pathname === "/hit") {
      const { today, total, day } = await readStats(env);
      const nextToday = today + 1;
      const nextTotal = total + 1;
      await Promise.all([
        env.COUNTER.put("day:" + day, String(nextToday), { expirationTtl: 7 * 86400 }),
        env.COUNTER.put("total", String(nextTotal)),
      ]);
      return new Response(JSON.stringify({ today: nextToday, total: nextTotal }), { headers });
    }

    if (url.pathname === "/stats") {
      const stats = await readStats(env);
      return new Response(JSON.stringify(stats), { headers });
    }

    return new Response(JSON.stringify({ error: "not found" }), { status: 404, headers });
  },
};