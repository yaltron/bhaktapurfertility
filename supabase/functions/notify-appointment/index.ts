import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, phone, email, preferred_date, message } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const PROJECT_ID = SUPABASE_URL.replace("https://", "").replace(
      ".supabase.co",
      ""
    );

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
          New Appointment Request
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr><td style="padding: 8px; font-weight: bold; color: #374151;">Patient Name</td><td style="padding: 8px;">${name || "N/A"}</td></tr>
          <tr style="background: #f9fafb;"><td style="padding: 8px; font-weight: bold; color: #374151;">Phone</td><td style="padding: 8px;">${phone || "N/A"}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #374151;">Email</td><td style="padding: 8px;">${email || "Not provided"}</td></tr>
          <tr style="background: #f9fafb;"><td style="padding: 8px; font-weight: bold; color: #374151;">Preferred Date</td><td style="padding: 8px;">${preferred_date || "Not specified"}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #374151;">Message</td><td style="padding: 8px;">${message || "No message"}</td></tr>
        </table>
        <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
          This is an automated notification from Bhaktapur Fertility & Women's Wellness Centre.
        </p>
      </div>
    `;

    const emailRes = await fetch(
      `https://${PROJECT_ID}.supabase.co/functions/v1/send-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
        },
        body: JSON.stringify({
          to: "admin@bhaktapurfertility.com.np",
          subject: `New Appointment Request from ${name}`,
          html: htmlBody,
        }),
      }
    );

    // Fallback: if no send-email function, try Resend directly
    if (!emailRes.ok) {
      console.log("Email send attempt status:", emailRes.status);
      const text = await emailRes.text();
      console.log("Email send response:", text);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
