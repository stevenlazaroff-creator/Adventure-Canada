// Supabase Edge Function: track-analytics
// Tracks page views, clicks, and other analytics events
//
// Deploy via Supabase Dashboard:
// 1. Go to Edge Functions
// 2. Click "New Function"
// 3. Name it "track-analytics"
// 4. Paste this code and deploy

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface AnalyticsPayload {
  listing_id: string;
  event_type: "view" | "website_click" | "phone_click" | "inquiry";
  visitor_id?: string;
  referrer?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const payload: AnalyticsPayload = await req.json();
    const { listing_id, event_type, visitor_id, referrer } = payload;

    // Validate required fields
    if (!listing_id || !event_type) {
      return new Response(
        JSON.stringify({ error: "listing_id and event_type are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate event type
    const validEventTypes = ["view", "website_click", "phone_click", "inquiry"];
    if (!validEventTypes.includes(event_type)) {
      return new Response(
        JSON.stringify({
          error: `Invalid event_type. Must be one of: ${validEventTypes.join(", ")}`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate UUID format for listing_id
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(listing_id)) {
      return new Response(
        JSON.stringify({ error: "Invalid listing_id format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get metadata from request headers
    const userAgent = req.headers.get("user-agent") || null;
    // Cloudflare/Vercel headers for country detection
    const ipCountry =
      req.headers.get("cf-ipcountry") ||
      req.headers.get("x-vercel-ip-country") ||
      null;

    // Insert analytics event using service role (bypasses RLS)
    const { data, error } = await supabase
      .from("analytics_events")
      .insert({
        listing_id,
        event_type,
        visitor_id: visitor_id || null,
        referrer: referrer || null,
        user_agent: userAgent,
        ip_country: ipCountry,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error inserting analytics event:", error);

      // Check if it's a foreign key error (listing doesn't exist)
      if (error.code === "23503") {
        return new Response(
          JSON.stringify({ error: "Listing not found" }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, event_id: data.id }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Analytics tracking error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to track event" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
