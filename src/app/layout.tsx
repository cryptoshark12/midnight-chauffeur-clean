import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";

export const metadata = {
  title: "Midnight Chauffeur",
  description: "Luxury chauffeur & limo services"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* Google Maps Places API */}
          <Script
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
            strategy="beforeInteractive"
          />
        </head>

        <body className="bg-[#05070A] text-white antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
