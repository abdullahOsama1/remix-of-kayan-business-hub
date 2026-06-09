// Edge function: parse raw WhatsApp text/logs into structured product entries
// using Lovable AI Gateway (free during preview).
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SYSTEM = `You extract phone/device product listings from raw Arabic/English WhatsApp logs.
Strip timestamps, sender names, emojis. Detect MULTIPLE products in one message.
Return ONLY valid JSON:
{"products":[{"name":string,"brand"?:string,"specs"?:string,"storage"?:string,"color"?:string,"condition"?:string,"battery"?:number,"price"?:number,"cost_price"?:number,"category"?:string,"notes"?:string}]}
- "cost_price" is the WHOLESALE/PURCHASE price (سعر الجملة / التكلفة). If only one price is mentioned, treat it as cost_price.
- "price" is the SELLING price (سعر البيع). Leave empty if not mentioned.
- battery is integer percent (no %). price/cost_price are numbers (no currency).
- "specs" is a short technical summary (RAM, screen, camera) when present.
- name is concise (e.g. "iPhone 13 Pro").`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "text required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: text.slice(0, 8000) },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (r.status === 429) return new Response(JSON.stringify({ error: "rate limited, try later" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (r.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!r.ok) {
      const t = await r.text();
      throw new Error(`AI error ${r.status}: ${t}`);
    }

    const data = await r.json();
    const content = data.choices?.[0]?.message?.content ?? "{}";
    let parsed: any = {};
    try { parsed = JSON.parse(content); } catch { parsed = { products: [] }; }
    const products = Array.isArray(parsed.products) ? parsed.products : [];

    return new Response(JSON.stringify({ products }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("ai-parse-products error", err);
    return new Response(JSON.stringify({ error: err?.message ?? "unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
