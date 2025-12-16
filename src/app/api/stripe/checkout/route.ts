export const runtime = "nodejs";

import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      bookingId,
      vehicle,
      stretchSize,
      meters,
      stopsCount,
      paymentType,
    } = body;

    if (!bookingId || !vehicle || !meters || !paymentType) {
      return NextResponse.json(
        { error: "Missing required Stripe data" },
        { status: 400 }
      );
    }

    // Base pricing logic (SERVER SIDE – SAFE)
    let rate = 2;
    let minimum = 50;

    if (vehicle === "suv") {
      rate = 2.5;
      minimum = 65;
    }

    if (vehicle === "lux-suv") {
      rate = 3.5;
      minimum = 90;
    }

    if (vehicle === "bus") {
      rate = 15;
      minimum = 750;
    }

    if (vehicle === "stretch") {
      if (stretchSize === "8") {
        rate = 4;
        minimum = 150;
      } else if (stretchSize === "14") {
        rate = 5;
        minimum = 250;
      } else {
        rate = 8;
        minimum = 500;
      }
    }

    const km = meters / 1000;
    let total = Math.max(minimum, km * rate);

    if (stopsCount > 0) {
      total +=
        (vehicle === "stretch" || vehicle === "bus" ? 30 : 15) *
        stopsCount;
    }

    if (paymentType === "deposit") {
      total = Math.round(total * 0.1);
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: "Midnight Chauffeur Booking",
              description: `Booking ID: ${bookingId}`,
            },
            unit_amount: Math.round(total * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?booking=${bookingId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking`,
      metadata: {
        bookingId,
        paymentType,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("❌ Stripe error:", err.message);
    return NextResponse.json(
      { error: "Stripe checkout failed" },
      { status: 500 }
    );
  }
}
