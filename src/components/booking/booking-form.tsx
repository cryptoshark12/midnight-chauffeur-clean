"use client";

import { useState } from "react";
import ServiceSelect from "./service-select";
import VehicleSelect from "./vehicle-select";
import AddressAutocomplete from "./address-autocomplete";
import { usePricing } from "@/hooks/usePricing";

export default function BookingForm() {
  const { pricing } = usePricing();

  /* =====================
     CORE BOOKING STATE
  ===================== */
  const [service, setService] = useState<"one-way" | "round-trip">("one-way");
  const [vehicle, setVehicle] = useState("");
  const [stretchSize, setStretchSize] = useState("");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [stops, setStops] = useState<string[]>([]);
  const [fare, setFare] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [distanceMeters, setDistanceMeters] = useState<number | null>(null);

  /* =====================
     MODAL + PAYMENT
  ===================== */
  const [showModal, setShowModal] = useState(false);
  const [paymentType, setPaymentType] = useState<"full" | "deposit">("deposit");
  const [paymentMethod, setPaymentMethod] =
    useState<"card" | "etransfer">("card");
  const [showTransferInfo, setShowTransferInfo] = useState(false);

  /* =====================
     CUSTOMER DETAILS
  ===================== */
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");

  /* =====================
     DERIVED VALUES
  ===================== */
  const canQuote =
    pickup &&
    dropoff &&
    vehicle &&
    (vehicle !== "stretch" || stretchSize);

  const depositAmount =
    fare !== null ? Math.round(fare * pricing.depositPercent) : 0;

  const payableNow =
    paymentType === "full" ? fare ?? 0 : depositAmount;

  /* =====================
     STOPS HELPERS
  ===================== */
  function addStop() {
    setStops([...stops, ""]);
  }

  function updateStop(i: number, value: string) {
    const copy = [...stops];
    copy[i] = value;
    setStops(copy);
  }

  function removeStop(i: number) {
    setStops(stops.filter((_, idx) => idx !== i));
  }

  /* =====================
     CALCULATE FARE
  ===================== */
  async function computeFare() {
    if (!canQuote) return;

    setLoading(true);

    const res = await fetch("/api/distance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pickup, stops, dropoff }),
    });

    const data = await res.json();
    const meters = data?.meters;

    if (!meters) {
      setLoading(false);
      return;
    }

    setDistanceMeters(meters);

    const km = meters / 1000;

    let rate = pricing.perKm.sedan;
    let minimum = pricing.minimum.sedan;

    if (vehicle === "suv") {
      rate = pricing.perKm.suv;
      minimum = pricing.minimum.suv;
    }

    if (vehicle === "lux-suv") {
      rate = pricing.perKm.luxSuv;
      minimum = pricing.minimum.luxSuv;
    }

    if (vehicle === "bus") {
      rate = pricing.perKm.bus30;
      minimum = pricing.minimum.bus30;
    }

    if (vehicle === "stretch") {
      if (stretchSize === "8") {
        rate = pricing.perKm.stretch8;
        minimum = pricing.minimum.stretch8;
      } else if (stretchSize === "14") {
        rate = pricing.perKm.stretch14;
        minimum = pricing.minimum.stretch14;
      } else {
        rate = pricing.perKm.stretch22;
        minimum = pricing.minimum.stretch22;
      }
    }

    let total = Math.max(minimum, km * rate);

    if (service === "round-trip") total *= 2;

    if (stops.length > 0) {
      const stopFee =
        vehicle === "stretch" || vehicle === "bus"
          ? pricing.stopFees.premium
          : pricing.stopFees.standard;

      total += stopFee * stops.length;
    }

    setFare(Math.round(total));
    setLoading(false);
  }

  /* =====================
     SUBMIT + STRIPE
  ===================== */
  async function submitBooking() {
    if (!name || !phone || !email || !pickupDate || !pickupTime) {
      alert("Please complete all required fields");
      return;
    }

    if (!distanceMeters) {
      alert("Please calculate fare first.");
      return;
    }

    // 1️⃣ Create booking
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        email,
        pickup,
        stops,
        dropoff,
        pickupDate,
        pickupTime,
        returnDate: service === "round-trip" ? returnDate : null,
        returnTime: service === "round-trip" ? returnTime : null,
        service,
        vehicle,
        stretchSize,
        fare,
        paymentType,
        paymentMethod,
        amountDueNow: payableNow,
      }),
    });

    const booking = await res.json();

    if (!booking?.id) {
      alert("Booking failed. Please try again.");
      return;
    }

    // 2️⃣ e-Transfer flow
    if (paymentMethod === "etransfer") {
      setShowTransferInfo(true);
      return;
    }

    // 3️⃣ Stripe checkout
    const stripeRes = await fetch("/api/stripe/checkout", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingId: booking.id,
        service,
        vehicle,
        stretchSize,
        meters: distanceMeters,
        stopsCount: stops.length,
        paymentType,
      }),
    });

    const stripeData = await stripeRes.json();

    if (stripeData?.url) {
      window.location.href = stripeData.url;
    } else {
      alert("Unable to start payment. Please try again.");
    }
  }

  /* =====================
     JSX
  ===================== */
  return (
    <div className="space-y-10">
      <ServiceSelect service={service} setService={setService} />
      <AddressAutocomplete label="Pickup Address" onSelect={setPickup} />

      {stops.map((_, i) => (
        <div key={i} className="relative">
          <AddressAutocomplete
            label={`Stop ${i + 1}`}
            onSelect={(v) => updateStop(i, v)}
          />
          <button
            type="button"
            onClick={() => removeStop(i)}
            className="absolute top-0 right-0 text-xs text-red-400"
          >
            Remove
          </button>
        </div>
      ))}

      <button type="button" onClick={addStop} className="text-sm text-gold underline">
        + Add Stop
      </button>

      <AddressAutocomplete label="Dropoff Address" onSelect={setDropoff} />

      <VehicleSelect
        vehicle={vehicle}
        setVehicle={setVehicle}
        stretchSize={stretchSize}
        setStretchSize={setStretchSize}
      />

      <button
        type="button"
        onClick={computeFare}
        disabled={!canQuote || loading}
        className="w-full py-4 rounded-xl bg-white text-black font-medium disabled:opacity-50"
      >
        {loading ? "Calculating..." : "Calculate Fare"}
      </button>

      {fare !== null && (
        <div className="text-center space-y-4">
          <p className="text-gray-400">Estimated Fare</p>
          <p className="text-4xl font-light">${fare}</p>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="px-8 py-4 rounded-2xl bg-gold text-black font-medium"
          >
            Book Now
          </button>
        </div>
      )}

      {/* =====================
          BOOKING MODAL
      ===================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="bg-[#05070A] border border-white/10 rounded-3xl p-6 md:p-8 max-w-xl w-full text-white relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4"
            >
              ✕
            </button>

            <h2 className="text-2xl font-light mb-6">Complete Your Booking</h2>

            <div className="space-y-4">
              <input placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
              <input placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} />
              <input placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} />
            <div>
  <p className="text-sm text-gray-400 mb-2">Pickup Date & Time</p>
  <div className="grid grid-cols-2 gap-4">
    <input
      type="date"
      value={pickupDate}
      onChange={(e) => setPickupDate(e.target.value)}
      className="rounded-xl bg-black border border-white/10 px-4 py-3 outline-none focus:border-gold"
    />

    <input
      type="time"
      value={pickupTime}
      onChange={(e) => setPickupTime(e.target.value)}
      className="rounded-xl bg-black border border-white/10 px-4 py-3 outline-none focus:border-gold"
    />
  </div>
</div>
{service === "round-trip" && (
  <div>
    <p className="text-sm text-gray-400 mb-2">Return Pickup Date & Time</p>
    <div className="grid grid-cols-2 gap-4">
      <input
        type="date"
        value={returnDate}
        onChange={(e) => setReturnDate(e.target.value)}
        className="rounded-xl bg-black border border-white/10 px-4 py-3 outline-none focus:border-gold"
      />

      <input
        type="time"
        value={returnTime}
        onChange={(e) => setReturnTime(e.target.value)}
        className="rounded-xl bg-black border border-white/10 px-4 py-3 outline-none focus:border-gold"
      />
    </div>
  </div>
)}
</div>

            <div className="mt-6 space-y-3">
              <label>
                <input type="radio" checked={paymentType === "full"} onChange={() => setPaymentType("full")} />
                Pay in full now
              </label>

              <label className="block">
                <input type="radio" checked={paymentType === "deposit"} onChange={() => setPaymentType("deposit")} />
                Pay {Math.round(pricing.depositPercent * 100)}% deposit now
              </label>

              <label className="block mt-3">
                <input type="radio" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
                Credit / Apple Pay / Google Pay
              </label>

              <label className="block">
                <input type="radio" checked={paymentMethod === "etransfer"} onChange={() => setPaymentMethod("etransfer")} />
                Interac e-Transfer
              </label>
            </div>

            <button
  type="button" 
  onClick={submitBooking}
  className="mt-6 w-full py-4 rounded-2xl bg-gold text-black font-medium"
>
  Proceed to Secure Payment
</button>
          </div>
        </div>
      )}

      {showTransferInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="bg-[#05070A] border border-white/10 rounded-3xl p-8 max-w-md text-center">
            <h3 className="text-2xl mb-4">Booking Received</h3>
            <p>Please send ${payableNow} to</p>
            <p className="font-medium mt-2">
              spotwork76@gmail.com
            </p>
            <button
              onClick={() => {
                setShowTransferInfo(false);
                setShowModal(false);
              }}
              className="mt-6 w-full py-3 rounded-xl bg-gold text-black"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
