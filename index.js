export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/live") {
      if (request.method !== "GET") {
        return Response.json({ error: "Method not allowed" }, { status: 405 });
      }
      if (!env.SPORTSAPI_KEY) {
        return Response.json({ error: "Missing SPORTSAPI_KEY secret" }, { status: 500 });
      }

      // Shared edge cache prevents every visitor from spending an API request.
      const cache = caches.default;
      const cacheKey = new Request(new URL("/api/live-cache", url.origin).toString(), request);
      let cached = await cache.match(cacheKey);
      if (cached) {
        const headers = new Headers(cached.headers);
        headers.set("X-Data-Source", "edge-cache");
        return new Response(cached.body, { status: cached.status, headers });
      }

      try {
        const upstream = await fetch("https://api.sportsapi.app/v2/livescores?sport=cricket", {
          headers: { "Authorization": `Bearer ${env.SPORTSAPI_KEY}`, "Accept": "application/json" }
        });
        const body = await upstream.text();
        const headers = {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "public, max-age=90",
          "X-Content-Type-Options": "nosniff"
        };
        const response = new Response(body, { status: upstream.status, headers });
        if (upstream.ok) ctx.waitUntil(cache.put(cacheKey, response.clone()));
        return response;
      } catch (error) {
        return Response.json({ error: "Unable to reach cricket data provider" }, { status: 502 });
      }
    }

    return env.ASSETS.fetch(request);
  }
};