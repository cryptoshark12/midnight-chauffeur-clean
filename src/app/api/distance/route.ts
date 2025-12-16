import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { pickup, stops, dropoff } = await req.json();

  if (!pickup || !dropoff) {
    return NextResponse.json(
      { error: "Missing locations" },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing API key" },
      { status: 500 }
    );
  }

  // Build ordered route
  const locations = [pickup, ...(stops || []), dropoff];

  let totalMeters = 0;

  for (let i = 0; i < locations.length - 1; i++) {
    const origin = encodeURIComponent(locations[i]);
    const destination = encodeURIComponent(locations[i + 1]);

    const url =
      `https://maps.googleapis.com/maps/api/distancematrix/json` +
      `?origins=${origin}` +
      `&destinations=${destination}` +
      `&units=metric` +
      `&region=ca` +
      `&key=${apiKey}`;

    const res = await fetch(url);
    const data = await res.json();

    const meters =
      data?.rows?.[0]?.elements?.[0]?.distance?.value;

    if (!meters) {
      return NextResponse.json(
        { error: "Distance calculation failed" },
        { status: 500 }
      );
    }

    totalMeters += meters;
  }

  return NextResponse.json({ meters: totalMeters });
}
