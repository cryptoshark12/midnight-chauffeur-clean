export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      phone,
      email,
      pickup,
      stops,
      dropoff,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      service,
      vehicle,
      stretchSize,
      fare,
      paymentType,
      paymentMethod,
      amountDueNow,
    } = body;

    // ✅ Basic validation
    if (!name || !phone || !email || !pickup || !dropoff) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Insert booking and RETURN inserted row
    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          name,
          phone,
          email,
          pickup,
          stops,
          dropoff,
          pickup_date: pickupDate,
          pickup_time: pickupTime,
          return_date: returnDate,
          return_time: returnTime,
          service,
          vehicle,
          stretch_size: stretchSize,
          fare,
          payment_type: paymentType,
          payment_method: paymentMethod,
          amount_due_now: amountDueNow,
          status: "new",
        },
      ])
      .select("*")
      .single();

    if (error || !data) {
      console.error("❌ Booking insert failed:", error);
      return NextResponse.json(
        { error: "Failed to create booking" },
        { status: 500 }
      );
    }

    console.log("✅ Booking created:", data.id);

    // ✅ Return EXACTLY what frontend expects
    return NextResponse.json({
      id: data.id,
    });
  } catch (err) {
    console.error("❌ Booking API error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
