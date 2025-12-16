import { Resend } from "resend";

/* =========================
   SAFE RESEND INITIALIZER
========================= */
function getResend() {
  const key = process.env.RESEND_API_KEY;

  if (!key) {
    throw new Error("❌ RESEND_API_KEY is missing");
  }

  return new Resend(key);
}

const FROM = "Midnight Chauffeur <onboarding@resend.dev>";

/* =========================
   NEW BOOKING EMAILS
========================= */
export async function sendAdminBookingEmail(b: any) {
  try {
    const resend = getResend();

    await resend.emails.send({
      from: FROM,
      to: [process.env.ADMIN_EMAIL!],
      subject: "🚘 New Booking Received",
      html: `
        <h2>New Booking</h2>
        <p><strong>Name:</strong> ${b.name}</p>
        <p><strong>Phone:</strong> ${b.phone}</p>
        <p><strong>Email:</strong> ${b.email}</p>
        <p><strong>Pickup:</strong> ${b.pickup}</p>
        <p><strong>Dropoff:</strong> ${b.dropoff}</p>
        <p><strong>Date & Time:</strong> ${b.pickup_date} @ ${b.pickup_time}</p>
        <p><strong>Fare:</strong> $${b.fare}</p>
      `,
    });

    console.log("✅ Admin booking email sent");
  } catch (err) {
    console.error("❌ Admin booking email failed:", err);
  }
}

export async function sendCustomerConfirmationEmail(b: any) {
  try {
    if (!b.email) return;

    const resend = getResend();

    await resend.emails.send({
      from: FROM,
      to: [b.email],
      subject: "Your Chauffeur Booking Confirmation",
      html: `
        <h2>Booking Received</h2>
        <p>Hi ${b.name},</p>
        <p>Your booking request has been received.</p>

        <p><strong>Pickup:</strong> ${b.pickup}</p>
        <p><strong>Dropoff:</strong> ${b.dropoff}</p>
        <p><strong>Date & Time:</strong> ${b.pickup_date} @ ${b.pickup_time}</p>
        <p><strong>Estimated Fare:</strong> $${b.fare}</p>

        <p>We’ll contact you shortly to confirm.</p>
        <p>— Midnight Chauffeur</p>
      `,
    });

    console.log("✅ Customer booking email sent");
  } catch (err) {
    console.error("❌ Customer booking email failed:", err);
  }
}

/* =========================
   STATUS CHANGE EMAILS
========================= */
export async function sendStatusChangeEmails(params: {
  booking: any;
  newStatus: string;
}) {
  const { booking, newStatus } = params;
  const STATUS = String(newStatus).toUpperCase();

  /* ADMIN */
  try {
    const resend = getResend();

    await resend.emails.send({
      from: FROM,
      to: [process.env.ADMIN_EMAIL!],
      subject: `🟡 Booking ${STATUS}: ${booking.name}`,
      html: `
        <h2>Status Updated</h2>
        <p><strong>Status:</strong> ${STATUS}</p>
        <p><strong>Name:</strong> ${booking.name}</p>
        <p><strong>Phone:</strong> ${booking.phone}</p>
        <p><strong>Email:</strong> ${booking.email}</p>
        <p><strong>Pickup:</strong> ${booking.pickup}</p>
        <p><strong>Date & Time:</strong> ${booking.pickup_date} @ ${booking.pickup_time}</p>
        <p><strong>Fare:</strong> $${booking.fare}</p>
      `,
    });

    console.log("✅ Admin status email sent");
  } catch (err) {
    console.error("❌ Admin status email failed:", err);
  }

  /* CUSTOMER */
  try {
    if (!booking.email) return;

    const resend = getResend();

    await resend.emails.send({
      from: FROM,
      to: [booking.email],
      subject: `Your booking is now ${STATUS}`,
      html: `
        <h2>Booking Status Update</h2>
        <p>Hi ${booking.name},</p>
        <p>Your booking status has been updated to:</p>
        <h3>${STATUS}</h3>

        <p><strong>Pickup:</strong> ${booking.pickup}</p>
        <p><strong>Date & Time:</strong> ${booking.pickup_date} @ ${booking.pickup_time}</p>

        <p>If you have any questions, reply to this email.</p>
        <p>— Midnight Chauffeur</p>
      `,
    });

    console.log("✅ Customer status email sent");
  } catch (err) {
    console.error("❌ Customer status email failed:", err);
  }
}
