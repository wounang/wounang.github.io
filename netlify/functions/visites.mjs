import { getStore } from "@netlify/blobs";

export default async (req) => {
  const headers = { "content-type": "application/json", "cache-control": "no-store" };
  try {
    const store = getStore({ name: "visites", consistency: "strong" });
    const url = new URL(req.url);
    let n = parseInt(await store.get("total"), 10);
    if (!Number.isFinite(n) || n < 0) n = 0;
    if (url.searchParams.get("hit") === "1") {
      n += 1;
      await store.set("total", String(n));
    }
    return new Response(JSON.stringify({ n }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: "indisponible" }), { status: 500, headers });
  }
};

export const config = { path: "/api/visites" };
