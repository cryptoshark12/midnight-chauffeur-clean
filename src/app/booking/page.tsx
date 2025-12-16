import BookingForm from "@/components/booking/booking-form";

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-midnight text-white px-6 py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-light text-center mb-12">Get Your Quote</h1>
        <BookingForm />
      </div>
    </main>
  );
}
