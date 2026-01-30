// Supabase Edge Function: create-operator
// Creates operator profile and free subscription after user signup
//
// Deploy via Supabase Dashboard:
// 1. Go to Edge Functions
// 2. Click "New Function"
// 3. Name it "create-operator"
// 4. Paste this code and deploy
//
// Then set up a Database Webhook trigger:
// 1. Go to Database > Webhooks
// 2. Create webhook on auth.users INSERT
// 3. Point to this function URL

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

interface CreateOperatorPayload {
  user_id: string;
  email: string;
  business_name: string;
  phone?: string;
}

// Alternative: Database webhook payload format
interface DatabaseWebhookPayload {
  type: "INSERT";
  table: "users";
  schema: "auth";
  record: {
    id: string;
    email: string;
    raw_user_meta_data?: {
      business_name?: string;
      phone?: string;
    };
  };
  old_record: null;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();

    let userId: string;
    let email: string;
    let businessName: string;
    let phone: string | null = null;

    // Check if this is a database webhook or direct API call
    if (body.type === "INSERT" && body.table === "users") {
      // Database webhook format
      const payload = body as DatabaseWebhookPayload;
      userId = payload.record.id;
      email = payload.record.email;
      businessName = payload.record.raw_user_meta_data?.business_name || "My Business";
      phone = payload.record.raw_user_meta_data?.phone || null;

      console.log(`Database webhook: Creating operator for user ${userId}`);
    } else {
      // Direct API call format
      const payload = body as CreateOperatorPayload;

      if (!payload.user_id || !payload.email || !payload.business_name) {
        return new Response(
          JSON.stringify({
            error: "user_id, email, and business_name are required",
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      userId = payload.user_id;
      email = payload.email;
      businessName = payload.business_name;
      phone = payload.phone || null;

      console.log(`API call: Creating operator for user ${userId}`);
    }

    // Check if operator already exists
    const { data: existingOperator } = await supabase
      .from("operators")
      .select("id")
      .eq("id", userId)
      .single();

    if (existingOperator) {
      console.log(`Operator already exists for user ${userId}`);
      return new Response(
        JSON.stringify({ success: true, message: "Operator already exists" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create operator record
    const { error: operatorError } = await supabase.from("operators").insert({
      id: userId,
      email,
      business_name: businessName,
      phone,
    });

    if (operatorError) {
      console.error("Error creating operator:", operatorError);
      throw operatorError;
    }

    console.log(`Operator created for user ${userId}`);

    // Create free subscription record
    const { error: subscriptionError } = await supabase
      .from("subscriptions")
      .insert({
        operator_id: userId,
        tier: "free",
      });

    if (subscriptionError) {
      console.error("Error creating subscription:", subscriptionError);
      // Rollback operator creation
      await supabase.from("operators").delete().eq("id", userId);
      throw subscriptionError;
    }

    console.log(`Free subscription created for user ${userId}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Operator and subscription created successfully",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Create operator error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create operator" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
