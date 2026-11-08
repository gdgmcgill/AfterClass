export async function GET() {
  const baseUrl = process.env.ML_API_URL;
  if (!baseUrl) {
    return Response.json({ error: "ML API is not configured" }, { status: 503 });
  }
  try {
    const upstream = await fetch(`${baseUrl.replace(/\/$/, "")}/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!upstream.ok) {
      return Response.json({ error: "ML API is unavailable" }, { status: 502 });
    }
    return Response.json({ ml: await upstream.json() });
  } catch {
    return Response.json({ error: "ML API is unavailable" }, { status: 502 });
  }
}
