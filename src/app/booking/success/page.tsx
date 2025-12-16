export default function BookingSuccessPage() {
  return (
    <main className="min-h-screen bg-[#05070A] text-white flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <h1 className="text-3xl font-light mb-4">Payment Successful</h1>
        <p className="text-gray-400">
          Your booking is confirmed. We’ll contact you shortly with details.
        </p>

        <a
          href="/"
          className="inline-block mt-8 px-8 py-4 rounded-2xl bg-gold text-black font-medium"
        >
          Back to Home
        </a>
      </div>
    </main>
  );
}
