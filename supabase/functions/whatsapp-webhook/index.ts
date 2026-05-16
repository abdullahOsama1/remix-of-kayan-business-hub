// Webhook endpoint to receive WhatsApp payloads from an external automation script.
// Accepts { text?: string, image_urls?: string[], source?: string, secret: string }
// Uses Lovable AI to parse the text into product fields, then saves an ai_drafts row.
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SYSTEM = `You extract phone/device product listings from raw Arabic/English WhatsApp messages.
Strip timestamps, sender names, emojis. Detect MULTIPLE products in one message.
Return ONLY valid JSON:
{"products":[{"name":string,"brand"?:string,"storage"?:string,"color"?:string,"condition"?:string,"battery"?:number,"price"?:number,"cost_price"?:number,"category"?:string,"notes"?:string}]}
battery is integer percent. price/cost_price are numbers (no currency).`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const { text, image_urls, source, secret } = body ?? {};

    // Optional shared secret for protecting the webhook
    const expected = Deno.env.get("WHATSAPP_WEBHOOK_SECRET");
    if (expected && secret !== expected) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!text && (!Array.isArray(image_urls) || image_urls.length === 0)) {
      return new Response(JSON.stringify({ error: "text or image_urls required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let products: any[] = [];
    if (text && typeof text === "string") {
      const apiKey = Deno.env.get("LOVABLE_API_KEY");
      if (!apiKey) throw new Error("LOVABLE_API_KEY missing");
      const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: text.slice(0, 8000) },
          ],
          response_format: { type: "json_object" },
        }),
      });
      if (r.ok) {
        const data = await r.json();
        try {
          const parsed = JSON.parse(data.choices?.[0]?.message?.content ?? "{}");
          if (Array.isArray(parsed.products)) products = parsed.products;
        } catch { /* ignore */ }
      }
    }

    if (Array.isArray(image_urls) && image_urls.length) {
      products = products.length ? products : [{}];
      products[0].images = image_urls;
    }

    const supa = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { error } = await supa.from("ai_drafts").insert({
      raw_input: text ?? null,
      parsed: products,
      source: source ?? "whatsapp",
    });
    if (error) throw error;

    return new Response(JSON.stringify({ ok: true, count: products.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("whatsapp-webhook error", err);
    return new Response(JSON.stringify({ error: err?.message ?? "unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
