"use client";

type Props = {
  id: string;
  status: string;
};

export default function BookingActions({ id, status }: Props) {
  async function updateStatus(newStatus: string) {
    await fetch("/api/bookings/status", {
  method: "POST",
  credentials: "include", // ✅ THIS IS THE FIX
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ id, status: newStatus }),
});


    // refresh page after update
    window.location.reload();
  }

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {status !== "confirmed" && (
        <button
          onClick={() => updateStatus("confirmed")}
          className="px-4 py-2 rounded-xl bg-green-600/20 text-green-300 text-sm"
        >
          Confirm
        </button>
      )}

      {status !== "completed" && (
        <button
          onClick={() => updateStatus("completed")}
          className="px-4 py-2 rounded-xl bg-gray-600/20 text-gray-300 text-sm"
        >
          Complete
        </button>
      )}

      {status !== "cancelled" && (
        <button
          onClick={() => updateStatus("cancelled")}
          className="px-4 py-2 rounded-xl bg-red-600/20 text-red-300 text-sm"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
