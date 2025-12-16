import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import BookingActions from "@/components/admin/BookingActions";

const ADMIN_EMAILS = ["spotwork76@gmail.com"];

/* =====================
   SUPABASE (SERVER)
===================== */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/* =====================
   STATUS BADGE
===================== */
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    new: "bg-blue-500/20 text-blue-300",
    confirmed: "bg-green-500/20 text-green-300",
    completed: "bg-gray-500/20 text-gray-300",
    cancelled: "bg-red-500/20 text-red-300",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        styles[status] ?? "bg-white/10 text-white"
      }`}
    >
      {status.toUpperCase()}
    </span>
  );
}

/* =====================
   PAGE
===================== */
export default async function AdminBookingsPage() {
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;

  if (!user || !email || !ADMIN_EMAILS.includes(email)) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#05070A] text-white">
        <p className="text-lg">Access denied</p>
      </main>
    );
  }

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load bookings:", error);
  }

  return (
    <main className="min-h-screen bg-[#05070A] text-white px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-light">Bookings</h1>

          <a href="/admin" className="text-sm underline text-gold">
            ← Back to Admin
          </a>
        </div>

        {!bookings || bookings.length === 0 ? (
          <p className="text-gray-400">No bookings yet.</p>
        ) : (
          <div className="space-y-6">
            {bookings.map((b: any) => (
              <div
                key={b.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                {/* HEADER */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">{b.name}</h3>
                  <StatusBadge status={b.status} />
                </div>

                <div className="grid lg:grid-cols-4 gap-6 text-sm text-gray-300">
                  {/* CUSTOMER */}
                  <div>
                    <p>{b.phone}</p>
                    <p>{b.email}</p>
                  </div>

                  {/* ROUTE */}
                  <div className="space-y-1">
                    <p>
                      <strong>Pickup:</strong> {b.pickup}
                    </p>

                    {b.stops?.length > 0 && (
                      <div>
                        <strong>Stops:</strong>
                        <ul className="list-disc ml-5">
                          {b.stops.map((s: string, i: number) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <p>
                      <strong>Dropoff:</strong> {b.dropoff}
                    </p>
                  </div>

                  {/* SCHEDULE */}
                  <div className="space-y-1">
                    <p>
                      <strong>Pickup:</strong>
                      <br />
                      {b.pickup_date} @ {b.pickup_time}
                    </p>

                    {b.return_date && (
                      <p>
                        <strong>Return:</strong>
                        <br />
                        {b.return_date} @ {b.return_time}
                      </p>
                    )}
                  </div>

                  {/* DETAILS */}
                  <div className="space-y-1">
                    <p>
                      <strong>Service:</strong> {b.service}
                    </p>
                    <p>
                      <strong>Vehicle:</strong> {b.vehicle}
                    </p>

                    {b.stretch_size && (
                      <p>
                        <strong>Stretch:</strong> {b.stretch_size} pax
                      </p>
                    )}

                    <p className="mt-2">
                      <strong>Fare:</strong> ${b.fare}
                    </p>

                    <p>
                      <strong>Payment:</strong>{" "}
                      {b.payment_type} / {b.payment_method}
                    </p>
                  </div>
                </div>

                {/* CLIENT ACTIONS */}
                <BookingActions id={b.id} status={b.status} />

                <div className="mt-4 text-xs text-gray-500">
                  Created: {new Date(b.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
