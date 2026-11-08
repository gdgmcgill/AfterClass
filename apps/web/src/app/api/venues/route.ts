import { createPublicDbClient } from "@/lib/supabase/client";

export async function GET() {
  try {
    const { data, error } = await createPublicDbClient()
      .from("venues")
      .select("id,name,category,address,latitude,longitude,created_at")
      .order("name");
    if (error) {
      return Response.json({ error: "Database query failed" }, { status: 502 });
    }
    return Response.json({ venues: data });
  } catch {
    return Response.json({ error: "Database is not configured" }, { status: 503 });
  }
}
