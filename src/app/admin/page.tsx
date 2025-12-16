import { currentUser } from "@clerk/nextjs/server";
import AdminClient from "./AdminClient";

const ADMIN_EMAILS = ["spotwork76@gmail.com"];

export default async function AdminPage() {
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;

  // ❌ Not logged in OR not you
  console.log("CLERK EMAIL:", email);
  if (!user || !email || !ADMIN_EMAILS.includes(email)) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#05070A] text-white">
        <p>Access denied</p>
      </main>
    );
  }

  // ✅ Logged in AND email matches
  return <AdminClient />;
}
