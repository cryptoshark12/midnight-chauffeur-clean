import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "Midnight Chauffeur",
  description: "Luxury transportation services",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-[#05070A] text-white">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
